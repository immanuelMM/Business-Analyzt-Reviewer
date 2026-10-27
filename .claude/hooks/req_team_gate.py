#!/usr/bin/env python3
"""Quality gates for the /req-team agent team.

Registered for TaskCreated, TaskCompleted and TeammateIdle in
.claude/settings.json (see docs/reference/agent-teams.md, "Enforce quality
gates with hooks"). Exit 2 blocks the action and sends stderr back to the
agent as feedback; exit 0 allows it.

The run folder comes from output/.current-run, which the lead writes when
/req-team starts. With no active run, every gate allows, so the hooks don't
get in the way of normal sessions.
"""
import json
import os
import re
import sys

MAX_IDLE_BLOCKS = 3  # stop nudging an idle teammate after this many tries
TAGS = ("[summarizer]", "[consolidator]", "[answerer]", "[lead]")


def block(msg):
    print(msg, file=sys.stderr)
    sys.exit(2)


def read(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except OSError:
        return None


def run_dir(project, teammate=""):
    """Return the run folder for this teammate.

    .current-run holds one run path per line. With several runs (one per input
    file), a teammate named e.g. 'summarizer-store-home' maps to the run folder
    ending in 'store-home'.
    """
    marker = read(os.path.join(project, "output", ".current-run"))
    runs = [l.strip() for l in (marker or "").splitlines() if l.strip()]
    if not runs:
        return None
    pick = runs[0]
    m = re.match(r"(?:summarizer|consolidator|answerer)-(.+)", (teammate or "").lower())
    if m:
        pick = next((r for r in runs if r.rstrip("/").endswith(m.group(1))), pick)
    return pick if os.path.isabs(pick) else os.path.join(project, pick)


def check_summary(run):
    """Return a list of problems with implementation-summary.md."""
    path = os.path.join(run, "implementation-summary.md")
    text = read(path)
    if text is None:
        return [f"{path} does not exist yet."]
    problems = []
    if not text.lstrip().startswith("# Implementation Summary"):
        problems.append("The file must start with '# Implementation Summary — <name>'.")
    if not re.search(r"^Sources:", text, re.M):
        problems.append("Add a 'Sources:' line that lists the requirement files.")
    if not re.search(r"\bBR-\d+", text):
        problems.append("No business rules found. Number them BR-1, BR-2 …")
    # every numbered rule / criterion needs a source reference in parentheses
    for line in text.splitlines():
        if re.match(r"\s*[-*]?\s*\**(BR|AC)-\d+", line) and "(" not in line:
            problems.append(f"Missing source ref, e.g. '(Req.docx §3.2)': {line.strip()[:80]}")
    unlabelled = [l for l in text.splitlines()
                  if "⚠ open question" in l and not re.search(r"OI-\d+", l)]
    for l in unlabelled[:5]:
        problems.append(f"Give each ⚠ open question an ID (OI-1, OI-2 …): {l.strip()[:80]}")
    return problems


def check_questions(run):
    """Return a list of problems with clarification-questions.md."""
    path = os.path.join(run, "clarification-questions.md")
    text = read(path)
    if text is None:
        return [f"{path} does not exist yet."]
    problems = []
    rows = [l for l in text.splitlines() if re.match(r"\|\s*Q-\d+\s*\|", l)]
    if not rows:
        return ["No question rows found. Use the table format with IDs Q-1, Q-2 …"]
    ids = [re.match(r"\|\s*(Q-\d+)", r).group(1) for r in rows]
    dups = sorted({i for i in ids if ids.count(i) > 1})
    if dups:
        problems.append(f"Duplicate question IDs: {', '.join(dups)}")
    for r in rows:
        cells = [c.strip() for c in re.split(r"(?<!\\)\|", r.strip().strip("|"))]
        if len(cells) < 7:
            problems.append(f"{cells[0]}: row needs all 7 columns.")
            continue
        qid, prio, typ, _q, src = cells[:5]
        if prio not in ("P1", "P2", "P3"):
            problems.append(f"{qid}: priority must be P1, P2 or P3 (got '{prio}').")
        if typ not in ("Conflict", "Gap", "Ambiguous"):
            problems.append(f"{qid}: type must be Conflict, Gap or Ambiguous (got '{typ}').")
        if '"' not in src and "“" not in src:
            problems.append(f"{qid}: quote the source text in the Source column.")
    # every open item in the summary must be answered by a question
    summary = read(os.path.join(run, "implementation-summary.md")) or ""
    missing = sorted(set(re.findall(r"OI-\d+", summary)) - set(re.findall(r"OI-\d+", text)),
                     key=lambda s: int(s[3:]))
    if missing:
        problems.append("These summary open items have no question (put the OI-ID in the "
                        f"Source column): {', '.join(missing)}")
    return problems


ANSWER_STATUSES = ("Answered", "Partial", "Contradicts", "Not in prototype")


def check_answers(run):
    """Return a list of problems with prototype-answers.md."""
    path = os.path.join(run, "prototype-answers.md")
    text = read(path)
    if text is None:
        return [f"{path} does not exist yet."]
    problems = []
    # only the main "## Answers" table counts; the Answered summary table repeats Q-IDs
    m = re.search(r"^## Answers\s*$(.*?)(?=^## |\Z)", text, re.M | re.S)
    body = m.group(1) if m else text
    rows = [l for l in body.splitlines() if re.match(r"\|\s*Q-\d+\s*\|", l)]
    if not rows:
        return ["No answer rows found. Use the table format with one row per Q-ID."]
    for r in rows:
        cells = [c.strip() for c in re.split(r"(?<!\\)\|", r.strip().strip("|"))]
        if len(cells) < 6:
            problems.append(f"{cells[0]}: row needs all 6 columns.")
            continue
        qid, _prio, status, _ans, evidence = cells[:5]
        if status not in ANSWER_STATUSES:
            problems.append(f"{qid}: status must be one of {', '.join(ANSWER_STATUSES)} "
                            f"(got '{status}').")
        elif status != "Not in prototype" and not re.search(r"[\w./-]+\.\w+:\d+", evidence):
            problems.append(f"{qid}: cite the prototype code as path:line in the Evidence column.")
    # every question in the list must have an answer row
    questions = read(os.path.join(run, "clarification-questions.md")) or ""
    asked = set(re.findall(r"^\|\s*(Q-\d+)\s*\|", questions, re.M))
    answered = {re.match(r"\|\s*(Q-\d+)", r).group(1) for r in rows}
    missing = sorted(asked - answered, key=lambda s: int(s[2:]))
    if missing:
        problems.append(f"These questions have no answer row: {', '.join(missing)}")
    return problems


def gate_for(name, run):
    name = (name or "").lower()
    if "summarizer" in name:
        return "implementation-summary.md", check_summary(run)
    if "consolidator" in name:
        return "clarification-questions.md", check_questions(run)
    if "answerer" in name:
        return "prototype-answers.md", check_answers(run)
    return None, []


def main():
    data = json.load(sys.stdin)
    project = os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd()
    run = run_dir(project, data.get("teammate_name", ""))
    if not run:
        sys.exit(0)
    event = data.get("hook_event_name")

    if event == "TaskCreated":
        subject = data.get("task_subject", "")
        if not subject.lower().startswith(TAGS):
            block("Task subject must start with its owner: [summarizer], [consolidator], "
                  f"[answerer] or [lead]. Got: '{subject}'")
        sys.exit(0)

    if event == "TaskCompleted":
        subject = data.get("task_subject", "").lower()
        owner = data.get("teammate_name") or subject
        # only the output-writing tasks are gated
        if subject.startswith("[consolidator]") and "question" not in subject:
            sys.exit(0)
        fname, problems = gate_for(owner, run)
        if problems:
            block(f"Can't complete '{data.get('task_subject')}'. Fix {fname}:\n- "
                  + "\n- ".join(problems))
        sys.exit(0)

    if event == "TeammateIdle":
        name = data.get("teammate_name", "")
        fname, problems = gate_for(name, run)
        if not problems:
            sys.exit(0)
        # the consolidator waits for the summarizer; let it idle until the summary is ready
        if "consolidator" in name.lower() and check_summary(run):
            sys.exit(0)
        # the answerer waits for the consolidator's question list
        if "answerer" in name.lower() and check_questions(run):
            sys.exit(0)
        counter = os.path.join(run, f".idle-blocks-{re.sub(r'[^a-z0-9-]', '', name.lower())}")
        n = int(read(counter) or 0)
        if n >= MAX_IDLE_BLOCKS:
            sys.exit(0)
        with open(counter, "w") as f:
            f.write(str(n + 1))
        block(f"Don't stop yet. {fname} isn't finished:\n- " + "\n- ".join(problems))

    sys.exit(0)


if __name__ == "__main__":
    main()
