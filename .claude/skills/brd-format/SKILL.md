---
name: brd-format
description: Format requirement documents into the team's BRD layout, taking the content from either the original spec or its /req-team implementation summary (asks the user which) (REQUIREMENTS DOCUMENT — M-n.0, sample in input/BRD-Formatter/) as PDF and Word, one brd-formatter agent per file. Use when the user asks to create/format a BRD or types /brd-format [file-or-module].
---

# BRD formatter

Argument (optional): a requirement file or a module name/ID (e.g. `store-home`, `M-7.0`). The default is every file in `input/requirements/`.

**One input file = one BRD.** Every requirement file becomes its own BRD (its own `brd.json`, PDF and DOCX).

**Content source: always ask the user.** Before anything else, use AskUserQuestion to ask where the BRD content should come from. Ask every run, even if the user has answered before. The two options are:
- **Implementation summary (plain language):** the `implementation-summary.md` that `/req-team` wrote for that file, in everyday words with a glossary. The BRD keeps all of its content, including the open items with their `⚠ open question` markers and Q-IDs.
- **Original spec (technical wording):** the requirement file in `input/requirements/`, copied verbatim. The BRD has no review comments and no clarification questions, and keeps the spec's own wording.

If the user names the source in the argument (e.g. `/brd-format store-home from summary`), skip the question. The chosen mode (`summary` or `spec`) applies to every file in the run. Whichever source is used, the BRD adds nothing that isn't in it.

## Steps (you are the lead)

1. **Load settings** from `input/BRD-Formatter/brd-config.json`: the header values, reference names and the `modules` list, which maps a file (by its `match` text) to its module `id`, `name` and `slug`.
2. **Resolve inputs.** Match each requirement file to exactly one module. If a file matches no module (or more than one), stop and ask the user which module ID and name it should get, then add it to `brd-config.json`.
   In `summary` mode, find each file's summary: the newest `output/<YYYY-MM-DD>-<slug>/implementation-summary.md` whose Sources line names that file. If a file has no summary yet, run `/req-team <file>` first, and wait for it to finish before going on.
3. **Check the tools.** `.claude/skills/req-team/.venv/bin/python -c "import fitz, docx, markdown"` must succeed. If it fails, run `.claude/skills/req-team/.venv/bin/pip install pymupdf python-docx markdown`, creating the venv first with `python3 -m venv .claude/skills/req-team/.venv` if it's missing.
4. **Create one output folder per file:** `output/brd/<module id>-<slug>/` (e.g. `output/brd/M-2.0-store-home/`).
5. **Spawn one `brd-formatter` agent per file**, named `brd-<slug>`, in the background and in parallel. Spawn at most 4 in one message, because larger batches have failed with "Lock file is already being held"; retry any spawn that fails. Give each agent:
   - the content source mode (`spec` or `summary`)
   - its original requirement file
   - in `summary` mode: its implementation summary (the content source), the run's `clarification-questions.md`, and the run's `prototype-answers.md` if there is one (questions the prototype answered are left out of the BRD)
   - its module entry (`id`, `name`, `slug`)
   - its output folder
   - the path to `brd-config.json`
   - the list of the other input files, which it must always check
6. **Wait** for every agent to report back. Don't do their work yourself.
7. **Verify each BRD.** Use `PY=.claude/skills/req-team/.venv/bin/python` and `R=.claude/skills/brd-format/brd_render.py`.
   - `$PY $R check <folder>/brd.json` must pass.
   - `$PY $R coverage <folder>/brd.json "<source .pdf or .md>"` must be ≥95%. Any missing passages must be ones the agent listed as headings, headers or footers. Specs with multi-column tables or inline link chips can score lower because PDF text extraction reorders them. In that case, grep `brd.json` for the key phrases of every reported passage; if all are present, accept the BRD and say so in the report.
   - In `summary` mode: run `$PY $R settled <run folder>`. Every OI in the summary must appear in `brd.json` **except** the `settled` ones, which must not appear anywhere. The Open items row must list every remaining OI with its still-open Q-IDs (for `partial` OIs, only the open ones). The references must include the Implementation Summary and Clarification Questions rows. Coverage may report the left-out OI lines as missing; accept that if those are the only gaps.
   - Every source table must be a `{"table": {"columns": […], "rows": […]}}` item with its header and cells verbatim, so it renders as a real table. Send back any BRD that flattens a table into bullets or rows like "Blocked · Allowed · Blocked".
   - The `.pdf` and `.docx` must exist and be newer than `brd.json`.

   If something fails, send it back to that agent with the exact output.
8. **Report to the user:** one row per file with the module ID, folder, content source, FR count, OI count (summary mode), coverage %, and PDF/DOCX paths. Mention that screenshot slots are placeholders unless images were supplied in `input/screenshots/<slug>/`. Then stop the agents.

## Consolidated BRD (all files in one document)

When the user asks for one BRD that combines the files, first make sure every per-file BRD exists and passes step 7. Then merge them with a script; this needs no agents:

```
PY=.claude/skills/req-team/.venv/bin/python
$PY .claude/skills/brd-format/brd_consolidate.py <module id> output/brd/<module id>-consolidated <M-id order…>
$PY .claude/skills/brd-format/brd_render.py check  output/brd/<module id>-consolidated/brd.json
$PY .claude/skills/brd-format/brd_render.py render output/brd/<module id>-consolidated/brd.json
```

Each per-file BRD becomes one section, in the order given (FR-1, FR-2 …). Its rows are renumbered from FR-<old>.k to FR-<section>.k. Its module row becomes the section row, and the M-x.0 row lists the sections. The user's current layout is M-4.0, merging M-2.0 to M-9.0 in workflow order, so Home is FR-1 and Settings is FR-8. Check that each section's coverage against its source (spec or summary) still matches the per-file BRD.

## Files
- `brd_render.py`: `check`, `coverage` and `render` (HTML → PDF via headless Chrome, plus DOCX via python-docx). The layout matches the sample BRD's tables.
- `input/BRD-Formatter/brd-config.json`: header people, module numbering (M-2.0 to M-9.0 in workflow order) and reference rows. Edit it to change these.
- Screenshots: put PNG/JPG files in `input/screenshots/<slug>/`. Agents link them to child rows by component name.
