---
name: req-team
description: Start the requirement review agent team. For each requirement file, a requirement-summarizer teammate writes an implementation-only summary, a question-consolidator teammate collects every conflict, gap and unclear point into one prioritised question list, and (when a prototype is in input/prototype/) a prototype-answerer teammate answers the questions the prototype already settles. Use when the user asks to review/summarize requirements or types /req-team [path-or-module].
---

# Requirement review agent team

Argument (optional): a file, a folder, or a module name. The default is `input/requirements/`.

**Prototype (optional):** if `input/prototype/` holds a front-end prototype (HTML, React or Vue; no database), each file also gets a prototype-answerer. With no prototype, skip every answerer step below.

**One input file = one run.** Every requirement file gets its own run folder, with its own summary and question list (plus PDFs). Never merge several input files into one summary or one question list.

## Steps (you are the team lead)

1. **Resolve inputs.** List the requirement files to review. If there are none, tell the user to put them in `input/requirements/` and stop.
2. **Create one run folder per input file**: `output/<YYYY-MM-DD>-<slug>/`, where `<slug>` is a short kebab-case name for that file (e.g. `TS-Store Home (Home Tab)-….pdf` → `store-home`). Write every run path into `output/.current-run`, one per line (relative, e.g. `output/2026-10-16-store-home`). This turns on the quality-gate hooks in `.claude/hooks/req_team_gate.py`, which match a teammate to its run by the slug at the end of its name.
3. **Spawn a pair of teammates for each input file** (an agent team, not plain subagents), all pairs working in parallel:
   - `summarizer-<slug>`, using the **requirement-summarizer** agent type
   - `consolidator-<slug>`, using the **question-consolidator** agent type

   - `answerer-<slug>`, using the **prototype-answerer** agent type (only when there is a prototype)

   Give each one its single input file, the full list of the other input files, its run folder path, and its partners' names so they can message each other. Give the answerer the prototype folder too, and tell the consolidator to message `answerer-<slug>` when its question list is final. Teammates must **always cross-check their file against every other input file** and raise any conflicts they find.
4. **Create a shared task list.** The `TaskCreated` hook rejects any subject that doesn't start with its owner tag. For each slug:
   - `[summarizer] <slug>: Summarize requirements for implementation`
   - `[consolidator] <slug>: Find conflicts, gaps and ambiguities`
   - `[consolidator] <slug>: Write consolidated question list` (depends on that slug's summarizer task)
   - `[answerer] <slug>: Answer questions from the prototype` (depends on the question-list task; only with a prototype)

   Hooks enforce quality: `TaskCompleted` won't close a task until its output file passes the checks, and `TeammateIdle` sends a teammate back to work (up to 3 times) if its file is missing or invalid. If no task-list tool is available, skip this step and run the checks in step 6 yourself.
5. **Wait** for all teammates to report back. Don't do their work yourself.
6. **Check each run:** both files exist, every `⚠ open question` in the summary has a matching Q-ID, and there are no duplicate questions. With a prototype, `prototype-answers.md` must have a row for every Q-ID. You can call `check_summary(run)`, `check_questions(run)` and `check_answers(run)` from `.claude/hooks/req_team_gate.py` directly. If something is wrong, send it back to the teammate that owns it.
7. **Make sure every output file has a PDF.** Teammates create their own PDFs; fill in any that are missing with `.claude/skills/req-team/.venv/bin/python .claude/skills/req-team/md_to_pdf.py <file.md> …`. If the `.venv` is missing, recreate it: `python3 -m venv .claude/skills/req-team/.venv && .claude/skills/req-team/.venv/bin/pip install markdown`. Each `.pdf` is written next to its `.md`.
8. **Report to the user:** a table with one row per input file showing its run folder, P1/P2/P3 counts and top blocker (plus, with a prototype, how many questions the prototype answered, how many it contradicts, and how many screens are missing from it), followed by the top 3 blockers overall that are still open, and any missing screen marked `No question yet`. Then shut down the teammates, clean up the team, and delete `output/.current-run` so the gates switch off.
