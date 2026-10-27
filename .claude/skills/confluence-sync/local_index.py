"""Print the header of every pulled Confluence page as JSON, keyed by confluence_id.

Usage: python3 local_index.py [folder]   (default: input/requirements/Team-Store-Confluence)
"""
import json
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else "input/requirements/Team-Store-Confluence")
index = {}
for path in sorted(root.rglob("*.md")):
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0] != "---":
        continue
    header = {}
    for line in lines[1:]:
        if line == "---":
            break
        key, _, value = line.partition(":")
        header[key.strip()] = value.strip()
    if "confluence_id" in header:
        index[header["confluence_id"]] = {
            "path": str(path.relative_to(root)),
            "title": header.get("title", ""),
            "version": header.get("version", ""),
            "last_modified": header.get("last_modified", ""),
            "pulled": header.get("pulled", ""),
        }
print(json.dumps(index, indent=1, ensure_ascii=False))
