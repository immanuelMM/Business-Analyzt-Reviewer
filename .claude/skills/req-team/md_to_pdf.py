#!/usr/bin/env python3
"""Render Markdown output files to PDF with headless Chrome.

Usage: python3 md_to_pdf.py <file.md> [<file.md> ...]
Writes <file>.pdf next to each input. Needs the `markdown` package
(pip install markdown) and Google Chrome.
"""
import html
import os
import re
import subprocess
import sys
import tempfile

import markdown

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@page { size: A4; margin: 16mm 14mm; }
body { font: 10.5pt/1.45 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #1a1a1a; }
h1 { font-size: 19pt; border-bottom: 2px solid #333; padding-bottom: 4px; }
h2 { font-size: 14pt; margin-top: 1.4em; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
h3 { font-size: 11.5pt; margin-top: 1.1em; }
table { border-collapse: collapse; width: 100%; font-size: 8.8pt; margin: .6em 0; }
th, td { border: 1px solid #bbb; padding: 4px 6px; vertical-align: top; text-align: left; }
th { background: #eee; }
tr { page-break-inside: avoid; }
code { font-size: 9pt; background: #f3f3f3; padding: 0 3px; }
blockquote { border-left: 3px solid #ccc; margin-left: 0; padding-left: 10px; color: #444; }
.id { white-space: nowrap; }
"""

# IDs such as Q-31, OI-9, BR-124, C-05, M-4.1 must never break at the hyphen,
# or "Q-" and "31" land on separate lines and the PDF can't be searched for them
ID_RE = re.compile(r"(?<![\w-])([A-Z]{1,3}-\d+(?:\.\d+)*)(?![\w-])")


def keep_ids_whole(body):
    # only touch text between tags, never tag attributes
    return re.sub(r">([^<]+)<", lambda m: ">" + ID_RE.sub(r"<span class='id'>\1</span>", m.group(1)) + "<", body)


def convert(md_path):
    with open(md_path, encoding="utf-8") as f:
        body = keep_ids_whole(markdown.markdown(f.read(), extensions=["tables", "fenced_code", "sane_lists"]))
    title = html.escape(os.path.splitext(os.path.basename(md_path))[0])
    page = (f"<!doctype html><html><head><meta charset='utf-8'><title>{title}</title>"
            f"<style>{CSS}</style></head><body>{body}</body></html>")
    pdf_path = os.path.splitext(md_path)[0] + ".pdf"
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as tmp:
        tmp.write(page)
    try:
        subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                        f"--print-to-pdf={os.path.abspath(pdf_path)}", f"file://{tmp.name}"],
                       check=True, capture_output=True)
    finally:
        os.unlink(tmp.name)
    print(pdf_path)


if __name__ == "__main__":
    for p in sys.argv[1:]:
        convert(p)
