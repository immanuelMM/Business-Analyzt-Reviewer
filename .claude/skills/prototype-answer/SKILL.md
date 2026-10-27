---
name: prototype-answer
description: Answer existing /req-team clarification questions from the front-end prototype (HTML, React or Vue; no database), one prototype-answerer agent per run folder. Use when the user asks to check the questions against the prototype or types /prototype-answer [run-folder-or-slug] [prototype-folder].
---

# Answer clarification questions from the prototype

Arguments (optional): a run folder or slug (e.g. `store-home`), and a prototype folder. The defaults are every `output/*/` folder that has a `clarification-questions.md`, using its latest dated run per slug, and `input/prototype/`.

## Steps (you are the lead)

1. **Resolve the prototype.** If the folder is missing or has no `.html`, `.js`, `.jsx`, `.ts`, `.tsx` or `.vue` files, tell the user to put the prototype in `input/prototype/` (or pass its path) and stop.
2. **Resolve the runs.** List the run folders that have a `clarification-questions.md`. If there are none, tell the user to run `/req-team` first and stop. For each run, find its requirement file in `input/requirements/` from the `Sources:` line.
3. **Spawn one `prototype-answerer` agent per run**, all in parallel. Give each one its run folder, the prototype folder and its requirement file. Its questions are final, so it doesn't wait for a consolidator.
4. **Check each run** with `check_answers(run)` from `.claude/hooks/req_team_gate.py`: every Q-ID has a row, Status values are valid, and evidence cites `path:line`. Send problems back to that agent.
5. **Make sure each `prototype-answers.md` has a PDF**: `.claude/skills/req-team/.venv/bin/python .claude/skills/req-team/md_to_pdf.py <file.md>`.
6. **Report to the user:** a table with one row per run showing Answered / Partial / Contradicts / Not in prototype counts and the number of missing screens, then every P1 question that is `Contradicts` or still open, then every missing screen marked `No question yet`.
