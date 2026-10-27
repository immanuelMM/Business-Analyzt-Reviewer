---
name: confluence-sync
description: Update the local copy of the Team Stores Confluence pages (input/requirements/Team-Store-Confluence/). Re-downloads only the pages changed since the last pull, adds new pages and reports deleted or moved ones, without deleting anything locally. Use when the user asks to sync/update/re-pull Confluence or types /confluence-sync [--all].
---

# Confluence sync (Team Stores)

Argument (optional): `--all` re-downloads every page whether it changed or not. The default downloads only changed and new pages.

**Fixed settings**
- Atlassian cloudId: `a5876142-1405-4e40-8294-c4c61ec9ffdb` (read-only access)
- Root: Confluence folder `4383211529` ("Requirements", under Team Stores, space TS)
- Local folder: `input/requirements/Team-Store-Confluence/`

**Never delete or overwrite anything outside the local folder.** The PDFs in `input/requirements/Team-Store/` are the user's own exports; leave them alone.

## Steps (you are the lead)

1. **Load tools:** ToolSearch `select:mcp__claude_ai_Atlassian_MCP__searchConfluence,mcp__claude_ai_Atlassian_MCP__getConfluenceContent`. If the Atlassian call fails with an auth error, tell the user to reconnect Atlassian in claude.ai and stop.
2. **List the remote pages:** searchConfluence with CQL `ancestor = 4383211529 AND type = page`, `limit` 100, `expand` `version`. Follow the cursor until you have every page. For each page keep its id, title, webUrl, version number and last-modified date.
3. **Work out each page's local path.** Run CQL `parent = <id>` on the root and on every folder or page that has children. The path mirrors Confluence: `<Folder title>/<parent page titles…>/<Page Title>.md`. A page with children also gets a subfolder of the same name. A page sitting directly in the root goes at the top of the local folder. Replace `/` in titles with `-`.
4. **Read the local index:** `python3 .claude/skills/confluence-sync/local_index.py`. It prints every local file's header keyed by `confluence_id`.
5. **Classify each page:**
   - **New:** id not in the local index.
   - **Changed:** the local header has `version` and the remote version is higher; or the local header has no `version` and the remote last-modified date is later than the local `last_modified`.
   - **Moved/renamed:** the id exists locally but the path from step 3 differs.
   - **Deleted:** a local id that no longer appears remotely.
   - **Unchanged:** everything else. With `--all`, treat every page as changed.
6. **Download the new and changed pages.** If there are more than 8, split them across up to 3 `general-purpose` agents in parallel; otherwise do it yourself. For each page: getConfluenceContent with `content_id`, `detail` `full`, `content_format` `markdown`, then write the file at its path with this header and the body exactly as returned, with no edits, summary or added text:
   ```
   ---
   title: <title>
   confluence_id: <id>
   url: <webUrl>
   version: <version number>
   last_modified: <YYYY-MM-DD>
   pulled: <today YYYY-MM-DD>
   ---
   ```
   When the result is too large to come back inline and is saved to a file instead, write the body from that file with a script, not by retyping it. Note every page Confluence flags as `lossyConversion`.
7. **Moved/renamed pages:** write the new file (as in step 6), then move the old file into `input/requirements/Team-Store-Confluence/_archive/<today>/` instead of deleting it.
8. **Deleted pages:** move the local file into `_archive/<today>/`. Never delete it.
9. **Report to the user:** a table of New / Changed / Moved / Archived pages with their paths and Confluence last-modified dates, the unchanged count, the total remote page count against the local file count, and any page that failed, came back empty or lost content in conversion. Don't run `/req-team`, `/brd-format` or anything else afterwards unless the user asks.
