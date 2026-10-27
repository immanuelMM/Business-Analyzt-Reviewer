#!/usr/bin/env python3
"""Merge per-file BRDs (output/brd/<M-id>-<slug>/brd.json) into one consolidated BRD.

Usage:
  brd_consolidate.py <module id> <out dir> <M-id> [<M-id> ...]
  e.g. brd_consolidate.py M-4.0 output/brd/M-4.0-consolidated M-2.0 M-3.0 M-4.0 M-5.0 M-6.0 M-7.0 M-8.0 M-9.0

Each source BRD becomes one section, in the order given: FR-1, FR-2 … Its rows are
renumbered (FR-<old n>.k -> FR-<section>.k, children likewise), and the source BRD's
module row becomes the section row. Content is copied unchanged.
"""
import copy
import datetime
import glob
import json
import os
import re
import sys

CONFIG = "input/BRD-Formatter/brd-config.json"


def renumber(text, old_n, new_n):
    return re.sub(rf"\bFR-{re.escape(str(old_n))}\.", f"FR-{new_n}.", text)


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(2)
    mod_id, out_dir, order = sys.argv[1], sys.argv[2], sys.argv[3:]
    cfg = json.load(open(CONFIG, encoding="utf-8"))
    mods = {m["id"]: m for m in cfg["modules"]}
    sections, phased, specs = [], [], []
    for s_no, mid in enumerate(order, 1):
        m = mods[mid]
        src = json.load(open(f"output/brd/{mid}-{m['slug']}/brd.json", encoding="utf-8"))
        major, minor = mid[2:].split(".")
        old_n = major if minor == "0" else f"{major}.{minor}"  # M-4.1 rows are FR-4.1.k
        reqs = copy.deepcopy(src["requirements"])
        for r in reqs:
            r["id"] = renumber(r["id"], old_n, s_no)
            if r.get("next"):
                r["next"] = renumber(r["next"], old_n, s_no)
            for ch in r.get("children") or []:
                ch["id"] = renumber(ch["id"], old_n, s_no)
        sections.append({"id": f"FR-{s_no}", "name": m["name"], "element": "",
                         "items": src["module"].get("items") or [], "requirements": reqs})
        for ph in src.get("phased") or []:
            ph = dict(ph, fr=renumber(ph.get("fr", ""), old_n, s_no))
            phased.append(ph)
        tech = next((x["location"] for x in src["references"] if x["name"] == "Technical Specs"), "")
        specs.append((f"FR-{s_no}", m["name"], tech or src_file(m)))

    names = [s["name"] for s in sections]
    out = {
        "file_prefix": cfg.get("project_prefix", "Team Store"),
        "module": {"id": mod_id, "name": "Store Workspace — Consolidated",
                   "items": [{"label": s["id"], "text": s["name"]} for s in sections]},
        "header": dict(cfg["header"], project_name=f"{cfg.get('project_prefix', 'Team Store')} (Store Workspace — "
                                                     + ", ".join(re.sub(r"\s*\(.*\)", "", n) for n in names) + ")"),
        "versions": [{"version": "v1.0.0", "br_fr": f"FR-1 – FR-{len(sections)}",
                      "remarks": "Consolidated BRD of " + ", ".join(f"{s[0]} {s[1]}" for s in specs)
                                 + f" (merged from per-file BRDs {', '.join(order)})",
                      "date": datetime.date.today().isoformat()}],
        "sections": sections,
        "phased": phased,
        "references": [{"name": n, "location": ""} for n in cfg["references"] if n != "Technical Specs"]
                      + [{"name": f"Technical Specs — {fr} {name}", "location": loc} for fr, name, loc in specs],
    }
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, "brd.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(path)


def src_file(m):
    hits = [f for f in glob.glob("input/requirements/*.pdf") if m["match"] in f]
    return hits[0] if hits else ""


if __name__ == "__main__":
    main()
