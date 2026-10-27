// Annotator — ⌘-click (Ctrl-click on Windows) any button, card or section to attach
// a description. Saved notes render as callouts with an arrow pointing at the element.
// Notes can carry a custom number (e.g. "1", "2a", "Step 3") and can be connected
// card-to-card with arrows (Step 1 → Step 2 → …) to show a flow.
// Each box can be hidden individually (it collapses to a small numbered pin).
// A screenshot of the element is captured whenever a note is saved, and "Report" turns
// every note (this page or all annotated pages) into a printable PDF or a Word .docx.
// Notes are stored per page in localStorage (screenshots in IndexedDB) and can be exported / imported as JSON.
(() => {
  "use strict";
  if (window.__annotatorLoaded) return;
  window.__annotatorLoaded = true;

  const PAGE = decodeURIComponent(location.pathname.split("/").pop() || "page").replace(/\.dc\.html$|\.html?$/, "");
  const KEY = "annotator:" + PAGE;
  const ACCENT = "#2563eb";
  const H2C_URL = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  const DOCX_URL = "https://cdn.jsdelivr.net/npm/docx@9.5.1/dist/index.iife.js";

  let notes = load();
  try { const pv = JSON.parse(localStorage.getItem("annotator-pages") || "[]"); if (!pv.includes(PAGE)) localStorage.setItem("annotator-pages", JSON.stringify(pv.concat(PAGE))); } catch {}
  let visible = true;
  let editor = null;          // { el, note, box }
  let hoverEl = null;
  let modHeld = false;
  let linking = null;         // id of the note we're drawing a connection from

  // Font + size options for a note's box (stored per note as note.font / note.size; unset = default Inter 13px).
  const FONTS = {
    default: ["Default (Inter)", ""], arial: ["Arial", "Arial, Helvetica, sans-serif"], helvetica: ["Helvetica", "Helvetica, Arial, sans-serif"],
    verdana: ["Verdana", "Verdana, Geneva, sans-serif"], georgia: ["Georgia", "Georgia, 'Times New Roman', serif"],
    times: ["Times New Roman", "'Times New Roman', Times, serif"], courier: ["Courier New", "'Courier New', Courier, monospace"],
    comic: ["Comic Sans MS", "'Comic Sans MS', 'Comic Sans', cursive"],
  };
  const SIZES = [11, 12, 13, 14, 16, 18, 20, 24, 28];
  const fontStack = (k) => (FONTS[k] || FONTS.default)[1];
  const lastFmt = () => { try { return JSON.parse(localStorage.getItem("annotator-fmt")) || {}; } catch { return {}; } };
  const setLastFmt = (font, size) => { try { localStorage.setItem("annotator-fmt", JSON.stringify({ font, size })); } catch {} };
  const numOf = (note, i) => (note.num != null && String(note.num).trim() !== "" ? String(note.num).trim() : String(i + 1));

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch {}
    syncCopies();
    updateToolbar(); autoUpdateSoon();
  }
  // The same note (same id) can end up saved on two pages, e.g. after importing notes into another mockup. It is
  // one note: an edit here updates its text on the other pages, and deleting it removes it there too.
  function otherPages() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("annotator:") !== 0 || k === KEY) continue;
      let list; try { list = JSON.parse(localStorage.getItem(k) || "[]"); } catch { continue; }
      if (Array.isArray(list) && list.length) out.push({ page: k.slice(10), key: k, notes: list });
    }
    return out;
  }
  function syncCopies() {
    const byId = new Map(notes.map((n) => [n.id, n]));
    for (const pg of otherPages()) {
      let changed = false;
      pg.notes.forEach((c) => { const n = byId.get(c && c.id); if (!n) return;
        for (const f of ["num", "sub", "body", "font", "size"]) if (c[f] !== n[f]) { c[f] = n[f]; changed = true; } });
      if (changed) try { localStorage.setItem(pg.key, JSON.stringify(pg.notes)); } catch {}
    }
  }
  // Remove notes from the other pages (their copies and those pages' screenshots of them).
  function dropCopies(ids, onlyPage) {
    const del = new Set(ids);
    for (const pg of otherPages()) {
      if (onlyPage && pg.page !== onlyPage) continue;
      const keep = pg.notes.filter((c) => !(c && del.has(c.id)));
      if (keep.length === pg.notes.length) continue;
      keep.forEach((c) => { if (c.links) c.links = c.links.filter((t) => !del.has(t)); });
      pg.notes.forEach((c) => { if (c && del.has(c.id)) idb("readwrite", (st) => st.delete(pg.page + ":" + c.id)).catch(() => {}); });
      try { keep.length ? localStorage.setItem(pg.key, JSON.stringify(keep)) : localStorage.removeItem(pg.key); } catch {}
    }
  }

  // ---------- element targeting ----------
  const isOurs = (el) => el && el.closest && el.closest("[data-annotator-ui]");
  const textOf = (el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);

  function selectorFor(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.documentElement) {
      if (el.id) { parts.unshift("#" + CSS.escape(el.id)); break; }
      const parent = el.parentElement;
      if (!parent) break;
      const idx = Array.prototype.indexOf.call(parent.children, el) + 1;
      parts.unshift(el.tagName.toLowerCase() + ":nth-child(" + idx + ")");
      el = parent;
    }
    return parts.join(" > ");
  }

  // A label for elements without text (inputs, icons, images, progress bars…), so they can be found again even
  // when their position in the page structure changes (different wizard state, other rows rendered, …).
  function hintOf(el) {
    const a = (n) => (el.getAttribute(n) || "").trim();
    const h = a("placeholder") || a("aria-label") || a("title") || a("alt") || a("name") ||
      (el.tagName === "IMG" ? (a("src").split("/").pop() || "").split("?")[0] : "");
    return h.slice(0, 80);
  }
  const matches = (el, note) => el.tagName.toLowerCase() === note.tag &&
    (note.text ? textOf(el) === note.text : !note.hint || hintOf(el) === note.hint);
  // Is the element actually visible right now (on screen and not hidden behind e.g. a modal)?
  const seen = (el) => {
    const r = el.getBoundingClientRect();
    return !!(r.width || r.height) && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && !coveredAt(el, r);
  };

  const cache = new Map(), lastScan = new Map();
  function resolve(note) {
    if (note.manual) return null; // added with "+ Add": not attached to an element
    const hit = cache.get(note.id), now = performance.now();
    const hitOk = !!(hit && hit.isConnected && matches(hit, note));
    const recent = now - (lastScan.get(note.id) || 0) < 400;
    if (hitOk && (recent || seen(hit))) return hit;
    if (!hitOk && hit === null && recent) return null; // nothing matched a moment ago: don't rescan every frame
    lastScan.set(note.id, now);
    // Candidates: the saved path, then every element with the same tag + text (or label). When the same text
    // appears more than once (e.g. a team name on the page and inside a modal), prefer the one you can see.
    const cands = [];
    let el = null;
    try { el = document.querySelector(note.selector); } catch {}
    if (el && !isOurs(el) && matches(el, note)) cands.push(el);
    if (note.text || note.hint) {
      const all = document.getElementsByTagName(note.tag);
      for (let i = 0; i < all.length; i++) if (!isOurs(all[i]) && !cands.includes(all[i]) && matches(all[i], note)) cands.push(all[i]);
    }
    const pick = cands.find(seen) || (hitOk ? hit : cands[0]) || null;
    cache.set(note.id, pick);
    return pick;
  }

  // ---------- styles ----------
  const style = document.createElement("style");
  style.textContent = `
  [data-annotator-ui]{font-family:Inter,system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.4;color:#0e0e10;box-sizing:border-box}
  [data-annotator-ui] *{box-sizing:border-box}
  .ann-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
  .ann-layer svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .ann-hl{position:fixed;pointer-events:none;z-index:2147483001;border:2px solid ${ACCENT};background:rgba(37,99,235,.08);border-radius:4px;transition:all .06s}
  .ann-ring{position:absolute;border:2px dashed ${ACCENT};border-radius:4px}
  .ann-card{position:absolute;pointer-events:auto;width:260px;min-width:140px;min-height:36px;max-width:70vw;max-height:70vh;background:#fff;border:1.5px solid ${ACCENT};border-radius:8px;
    padding:8px 10px;box-shadow:0 6px 20px rgba(20,20,40,.18);cursor:grab;white-space:pre-wrap;word-break:break-word;resize:both;overflow:auto}
  .ann-card:active{cursor:grabbing}
  .ann-card.ann-snapping{resize:none;box-shadow:none}
  .ann-card.ann-snapping .ann-acts{display:none !important}
  .ann-card.ann-snapping .ann-chip{display:inline-block;vertical-align:middle}
  .ann-card.ann-snapping .ann-ic{display:inline-block;height:16px;line-height:16px;text-align:center;vertical-align:-3px;margin-right:5px}
  .ann-num{float:left;margin:0 7px 0 -3px;min-width:17px;height:17px;padding:0 5px;border-radius:9px;background:${ACCENT};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;white-space:nowrap;cursor:text}
  .ann-card.ann-src{box-shadow:0 0 0 3px rgba(37,99,235,.35),0 6px 20px rgba(20,20,40,.18)}
  .ann-linking .ann-card:not(.ann-src){cursor:copy;outline:2px dashed ${ACCENT};outline-offset:3px}
  .ann-linking .ann-card:not(.ann-src):hover .ann-acts{display:none}
  .ann-link-hit{pointer-events:stroke;cursor:pointer}
  .ann-link-hit:hover + .ann-link{stroke:#e1251b}
  .ann-banner{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483003;background:${ACCENT};color:#fff;border-radius:8px;padding:7px 12px;font-weight:600;box-shadow:0 4px 14px rgba(20,20,40,.2);display:none}
  .ann-card .ann-acts{display:none;position:absolute;top:4px;right:4px;gap:4px;background:#fff;padding:2px;border-radius:6px}
  .ann-card:hover .ann-acts{display:flex}
  .ann-acts button,.ann-editor button,.ann-bar button{border:1px solid #d8d8de;background:#fff;border-radius:5px;font:inherit;font-size:12px;cursor:pointer;padding:3px 8px;color:#0e0e10}
  .ann-acts button{padding:1px 6px;font-size:11px;box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .ann-editor{position:fixed;z-index:2147483004;width:420px;height:240px;min-width:220px;min-height:150px;max-width:80vw;max-height:80vh;background:#fff;border:1.5px solid ${ACCENT};border-radius:10px;padding:10px;box-shadow:0 10px 30px rgba(20,20,40,.25);resize:both;overflow:auto;display:flex;flex-direction:column}
  .ann-editor .ann-head{flex:none;display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .ann-editor .ann-head label{flex:none;font-size:11px;font-weight:600;color:#6b6b72;display:flex;align-items:center;gap:4px}
  .ann-editor .ann-numin{width:64px;border:1px solid #d8d8de;border-radius:5px;padding:2px 6px;font:inherit;font-size:12px;outline:none}
  .ann-editor .ann-numin:focus{border-color:${ACCENT}}
  .ann-editor .ann-target{flex:1;min-width:0;font-size:11px;color:#6b6b72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ann-editor textarea{flex:1;width:100%;min-height:60px;resize:none;border:1px solid #d8d8de;border-radius:6px;padding:7px;font:inherit;outline:none}
  .ann-editor textarea:focus{border-color:${ACCENT};box-shadow:0 0 0 3px rgba(37,99,235,.15)}
  .ann-editor .ann-row{flex:none;display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center}
  .ann-editor .ann-row button{white-space:nowrap}
  .ann-editor .ann-row .ann-sp{flex:1;font-size:11px;color:#9a9aa1}
  .ann-editor .ann-primary,.ann-bar .ann-primary{background:${ACCENT};border-color:${ACCENT};color:#fff}
  .ann-editor .ann-danger{color:#e1251b}
  .ann-bar{position:fixed;left:14px;bottom:14px;z-index:2147483002;display:flex;gap:6px;align-items:center;background:#fff;border:1px solid #e5e5e9;border-radius:8px;padding:6px 8px;box-shadow:0 4px 14px rgba(20,20,40,.14)}
  .ann-bar .ann-add{font-weight:700;border-color:${ACCENT};color:${ACCENT}}
  .ann-bar button.ann-pending{border-color:#f59e0b;background:#fffbeb}
  .ann-bar .ann-lbl{font-weight:600;font-size:12px;padding:0 4px}
  .ann-bar .ann-hint{font-size:11px;color:#6b6b72;padding-right:4px}
  .ann-pin{position:absolute;pointer-events:auto;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#fff;border:1.5px dashed ${ACCENT};color:${ACCENT};font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;box-shadow:0 2px 6px rgba(20,20,40,.15)}
  .ann-pin:hover{background:${ACCENT};color:#fff}
  .ann-list{position:fixed;top:12px;right:12px;bottom:12px;z-index:2147483003;width:380px;max-width:calc(100vw - 24px);background:#fff;border:1px solid #e5e5e9;border-radius:12px;box-shadow:0 14px 40px rgba(20,20,40,.22);display:none;flex-direction:column;overflow:hidden}
  .ann-list.open{display:flex}
  .ann-list.ann-left{right:auto;left:12px;bottom:62px}
  .ann-list .lh{flex:none;display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #ececf0}
  .ann-list .lh b{font-size:14px;flex:1}
  .ann-list .lcp{flex:none;padding:8px 14px;border-bottom:1px solid #f3d9a4;background:#fff8e6;color:#7a4b00;font-size:12px;line-height:1.45}
  .ann-list .lcp button{margin-left:4px;font:inherit;font-weight:600;padding:2px 8px;border:1px solid #e0b866;border-radius:6px;background:#fff;color:#7a4b00;cursor:pointer}
  .ann-list .lf{flex:none;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 14px;border-bottom:1px solid #ececf0;background:#fafafb;font-size:12px}
  .ann-list .lf label{display:flex;align-items:center;gap:5px;cursor:pointer;margin-right:auto}
  .ann-list .lb{flex:1;overflow:auto}
  .ann-list .row{display:flex;gap:9px;padding:10px 14px;border-bottom:1px solid #f1f1f3;align-items:flex-start}
  .ann-list .row:hover{background:#fafbff}
  .ann-list .row input[type=checkbox]{margin-top:3px}
  .ann-list .mn{flex:1;min-width:0}
  .ann-list .tl{display:flex;gap:6px;align-items:center}
  .ann-list .tl .t{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ann-list .nb{flex:none;min-width:17px;height:17px;padding:0 5px;border-radius:9px;background:${ACCENT};color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
  .ann-list .el{font-size:11px;color:#8a8a92;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
  .ann-list .st{display:inline-block;font-size:10.5px;font-weight:600;border-radius:9px;padding:1px 7px;margin-top:4px}
  .ann-list .st.ok{background:#e7f5ed;color:#1f7a44}.ann-list .st.hid{background:#eef0f4;color:#555}
  .ann-list .st.off{background:#eaf1ff;color:#1d4ed8}.ann-list .st.cov{background:#fff4e0;color:#9a5b00}.ann-list .st.miss{background:#fde8e7;color:#b81d14}.ann-list .st.man{background:#f1ecff;color:#5b3fc4}
  .ann-quick{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;font-size:12px;color:#555}
  .ann-quick button,.ann-quick select{font:inherit;font-size:12px;border:1px solid #d8d8de;background:#fff;border-radius:6px;padding:3px 8px;cursor:pointer;color:#0e0e10}
  .ann-quick button:hover{border-color:${ACCENT};color:${ACCENT}}
  .ann-list .ac{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
  .ann-list button{border:1px solid #d8d8de;background:#fff;border-radius:5px;font:inherit;font-size:11.5px;cursor:pointer;padding:2px 8px;color:#0e0e10}
  .ann-list button:disabled{opacity:.4;cursor:default}
  .ann-list button.del{color:#e1251b}
  .ann-list button.pr{background:${ACCENT};border-color:${ACCENT};color:#fff}
  .ann-list textarea{width:100%;min-height:70px;margin-top:6px;border:1px solid #d8d8de;border-radius:6px;padding:6px;font:inherit;font-size:12px;resize:vertical}
  .ann-list .si{width:100%;border:1px solid #d8d8de;border-radius:5px;padding:2px 6px;font:inherit;font-size:12px;margin-top:6px;display:block}
  .ann-list .sb{color:#5b5b66;font-size:11.5px;font-style:italic;margin-top:1px}
  .ann-editor .ann-subin{width:100%;border:1px solid #d8d8de;border-radius:5px;padding:4px 8px;font:inherit;font-size:12px;outline:none;margin:0 0 8px;display:block}
  .ann-editor .ann-subin:focus{border-color:${ACCENT}}
  .ann-list .ni{width:90px;border:1px solid #d8d8de;border-radius:5px;padding:2px 6px;font:inherit;font-size:12px;margin-top:6px}
  .ann-list .empty{padding:30px 14px;color:#8a8a92;text-align:center}
  .ann-list .row{cursor:pointer}
  .ann-list .rn{display:inline-block;margin-top:3px;font-size:10.5px;font-weight:600;color:#1d4ed8;background:#e8efff;border-radius:4px;padding:1px 6px}
  .ann-list .xrow{padding:6px 14px 8px 40px;background:#fcfcfd;gap:8px;cursor:default}
  .ann-list .xrow:hover{background:#f6f8ff}
  .ann-list .xrow img{flex:none;width:64px;height:44px;object-fit:contain;border:1px solid #e3e3e8;border-radius:4px;background:#fff}
  .ann-list .xrow .nb{background:#16a34a}
  .ann-list .xrow .xc{font-size:11.5px;color:#55555c;margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
  .ann-list .row.active{background:#eef3ff;box-shadow:inset 3px 0 0 ${ACCENT}}
  .ann-ring.ann-active{border:3px solid ${ACCENT};background:rgba(37,99,235,.10);animation:annPulse 1.6s ease-in-out infinite}
  @keyframes annPulse{50%{box-shadow:0 0 0 6px rgba(37,99,235,.28)}}
  .ann-card.ann-active{z-index:1;box-shadow:0 0 0 3px rgba(37,99,235,.45),0 6px 20px rgba(20,20,40,.18)}
  .ann-card.ann-active.ann-snapping{box-shadow:none}
  .ann-card.ann-flash{animation:annCardFlash 1.2s ease 2}
  @keyframes annCardFlash{50%{box-shadow:0 0 0 6px rgba(37,99,235,.45),0 6px 20px rgba(20,20,40,.18)}}
  .ann-editor:not(.ann-full) .ann-row .ann-sp{flex:1;font-size:0}
  .ann-editor .ann-fullbtn{flex:none;margin-left:auto;padding:2px 7px;font-size:11px}
  .ann-editor .ann-fmt{flex:none;display:flex;gap:6px;margin-bottom:6px}
  .ann-editor .ann-fmt select{border:1px solid #d8d8de;border-radius:5px;background:#fff;font:inherit;font-size:12px;padding:2px 4px;color:#0e0e10;cursor:pointer}
  .ann-editor .ann-fmt .ann-font{flex:1;min-width:0}
  .ann-editor.ann-full{left:4vw!important;top:4vh!important;width:92vw!important;height:92vh!important;max-width:none;max-height:none;resize:none;padding:16px;box-shadow:0 0 0 100vmax rgba(14,14,16,.35),0 20px 60px rgba(20,20,40,.35)}
  .ann-editor.ann-full textarea{padding:14px;line-height:1.55}
  .ann-editor .ann-bold{min-width:26px;font-size:13px}
  .ann-card .ann-body b{font-weight:700}
  .ann-card .ann-body{display:block}
  .ann-card .ann-sub{color:#5b5b66;font-size:.88em;font-style:italic;margin:1px 0 2px}
  .ann-card .ann-ln{white-space:pre-wrap}
  .ann-card .ann-bu{display:inline-block;width:1.1em;text-indent:0;color:#52525a}
  .ann-hlgrp{display:inline-flex}
  .ann-hlgrp button[data-act="hl"]{border-radius:5px 0 0 5px;display:inline-flex;align-items:center;gap:5px}
  .ann-hlgrp button[data-act="hlmenu"]{border-radius:0 5px 5px 0;border-left:0;padding:3px 5px}
  .ann-dot{display:inline-block;width:10px;height:10px;border-radius:3px;border:1px solid rgba(0,0,0,.18)}
  .ann-hlpop{position:fixed;z-index:2147483646;background:#fff;border:1px solid #e5e5e9;border-radius:10px;padding:10px;box-shadow:0 10px 30px rgba(20,20,40,.22);width:196px}
  .ann-hlpop .hh{font-size:11px;font-weight:600;color:#6b6b72;margin-bottom:7px}
  .ann-hlpop .sw{display:flex;gap:6px;margin-bottom:9px}
  .ann-hlpop .sw button{width:24px;height:24px;border-radius:6px;border:1px solid rgba(0,0,0,.15);cursor:pointer;padding:0}
  .ann-hlpop .sw button:hover{transform:scale(1.1)}
  .ann-hlpop .sw button.on{box-shadow:0 0 0 2px #fff,0 0 0 4px ${ACCENT}}
  .ann-hlpop .rm{width:100%;border:1px solid #d8d8de;background:#fff;border-radius:6px;font:inherit;font-size:12px;cursor:pointer;padding:5px 8px;color:#e1251b;text-align:left}
  .ann-hlpop .rm:disabled{color:#b0b0b6;cursor:default}
  .ann-confirm{position:fixed;inset:0;z-index:2147483647;background:rgba(14,14,16,.38);display:flex;align-items:center;justify-content:center;padding:16px}
  .ann-confirm .cb{width:400px;max-width:100%;background:#fff;border-radius:12px;padding:20px;box-shadow:0 20px 50px rgba(20,20,40,.3)}
  .ann-confirm h4{margin:0 0 6px;font-size:15px}
  .ann-confirm p{margin:0 0 10px;color:#52525a}
  .ann-confirm ul{margin:0 0 12px;padding:8px 10px 8px 26px;max-height:160px;overflow:auto;background:#f7f7f9;border-radius:8px;font-size:12.5px}
  .ann-confirm ul b{margin-right:6px}
  .ann-confirm .ann-mods{max-height:240px;overflow:auto;background:#f7f7f9;border-radius:8px;padding:6px 10px}
  .ann-confirm .ann-mods label{display:flex;gap:7px;align-items:baseline;padding:3px 0;font-size:12.5px;cursor:pointer}
  .ann-confirm .ann-mods small{color:#7a7a82}
  .ann-confirm .ca{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
  .ann-confirm button{border:1px solid #d8d8de;background:#fff;border-radius:6px;font:inherit;font-weight:600;cursor:pointer;padding:7px 14px;color:#0e0e10}
  .ann-confirm button.dz{background:#e1251b;border-color:#e1251b;color:#fff}
  .ann-confirm button.pr{background:${ACCENT};border-color:${ACCENT};color:#fff}
  .ann-hl.ann-hl-shot{border-color:#16a34a;background:rgba(22,163,74,.10);border-style:dashed}
  .ann-shotpick .cb{width:460px}
  .ann-shotpick .pv{display:block;max-width:100%;max-height:220px;margin:4px auto 12px;border:1px solid #e5e5e9;border-radius:6px}
  .ann-shotpick .fl{display:flex;gap:8px;align-items:center;margin:0 0 8px}
  .ann-shotpick .fl span{width:62px;flex:none;font-weight:600;font-size:12.5px}
  .ann-shotpick .fl-top{align-items:flex-start}.ann-shotpick .fl-top span{padding-top:6px}
  .ann-shotpick textarea{flex:1;min-width:0;font:inherit;font-size:12.5px;border:1px solid #d8d8de;border-radius:6px;padding:6px 8px;background:#fff;color:#0e0e10;resize:vertical;min-height:70px;tab-size:2}
  .ann-shotpick select,.ann-shotpick input{flex:1;min-width:0;font:inherit;font-size:12.5px;border:1px solid #d8d8de;border-radius:6px;padding:6px 8px;background:#fff;color:#0e0e10}
  .ann-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:2147483647;background:#0e0e10;color:#fff;font:600 12.5px/1.3 Inter,system-ui,sans-serif;padding:8px 14px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .ann-pop{position:fixed;left:14px;bottom:62px;z-index:2147483003;width:300px;background:#fff;border:1px solid #e5e5e9;border-radius:10px;padding:12px;box-shadow:0 10px 30px rgba(20,20,40,.2);display:none}
  .ann-pop h4{margin:0 0 8px;font-size:13px}
  .ann-pop label{display:flex;gap:8px;align-items:flex-start;padding:6px 4px;border-radius:6px;cursor:pointer}
  .ann-pop label:hover{background:#f5f7ff}
  .ann-pop small{display:block;color:#6b6b72;font-size:11px}
  .ann-pop .ann-mod{display:flex;gap:8px;align-items:center;padding:8px 4px 2px}
  .ann-pop .ann-mod span{font-weight:600;font-size:12px}
  .ann-pop .ann-delmod{flex:none;font:inherit;font-size:11.5px;padding:3px 7px;border:1px solid #f0c4c0;border-radius:6px;background:#fff;color:#b42318;cursor:pointer}
  .ann-pop .ann-delmod:disabled{opacity:.4;cursor:default}
  .ann-pop .ann-mod select{flex:1;min-width:0;font:inherit;font-size:12px;border:1px solid #d8d8de;border-radius:6px;padding:4px 6px;background:#fff}
  .ann-pop .ann-row{display:flex;gap:6px;justify-content:flex-end;margin-top:10px}
  .ann-pop button{border:1px solid #d8d8de;background:#fff;border-radius:5px;font:inherit;font-size:12px;cursor:pointer;padding:4px 10px;color:#0e0e10}
  .ann-pop .ann-primary{background:${ACCENT};border-color:${ACCENT};color:#fff}
  body.ann-picking, body.ann-picking *{cursor:crosshair !important}
  `;

  // ---------- DOM scaffolding ----------
  const layer = document.createElement("div");
  layer.className = "ann-layer"; layer.setAttribute("data-annotator-ui", "");
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.innerHTML = `<defs><marker id="ann-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${ACCENT}"/></marker></defs>`;
  layer.appendChild(svg);

  const hl = document.createElement("div");
  hl.className = "ann-hl"; hl.setAttribute("data-annotator-ui", ""); hl.style.display = "none";

  const bar = document.createElement("div");
  bar.className = "ann-bar"; bar.setAttribute("data-annotator-ui", "");
  const banner = document.createElement("div");
  banner.className = "ann-banner"; banner.setAttribute("data-annotator-ui", "");
  banner.textContent = "Click another note to connect it · click the same pair again to disconnect · Esc to cancel";
  bar.innerHTML = `<span class="ann-lbl">Notes <span data-count>0</span></span>
    <span class="ann-hint" title="${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘⇧" : "Ctrl+Shift+"}click an element to screenshot it into an FR of the report (it isn't added as a note)">${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"}+click to add · ${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘⇧" : "Ctrl+Shift"}+click to screenshot</span>
    <button data-act="add" class="ann-add" title="Add an FR or module manually — no ${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"}-click needed. It isn't attached to an element and shows in All notes and the report.">+ Add</button>
    <button data-act="list" title="See every note on this page — also ones whose box you can't see — and edit, re-attach or delete them">All notes</button>
    <button data-act="toggle">Hide</button>
    <button data-act="unhide" title="Show the boxes you hid one by one">Show hidden</button>
    <button data-act="report" class="ann-primary" title="Generate a PDF or Word report of every note, with screenshots">Report</button>
    <button data-act="doc" style="display:none">⟳ Update doc</button>
    <button data-act="export" title="Download every note on every annotated page, with screenshots, extra screenshots and report fields">Export</button>
    <button data-act="import">Import</button>
    <button data-act="clear">Clear</button>
    <input type="file" accept="application/json" style="display:none">`;
  const pop = document.createElement("div");
  pop.className = "ann-pop"; pop.setAttribute("data-annotator-ui", "");

  function mount() {
    style.textContent += ".ann-card " + HL_CSS + CHIP_CSS.replace(/\.ann-chip/g, ".ann-card .ann-chip").replace(/\.ann-ic/g, ".ann-card .ann-ic");
    document.head.appendChild(style);
    document.body.appendChild(layer);
    document.body.appendChild(hl);
    document.body.appendChild(bar);
    document.body.appendChild(banner);
    document.body.appendChild(pop);
    document.body.appendChild(list);
    updateToolbar(); updateDocBtn();
    requestAnimationFrame(tick);
  }

  // "⟳ Update doc" shows while a Word file is linked; a dot means changes are waiting (e.g. Chrome needs a click
  // to allow writing again after the browser restarted).
  async function updateDocBtn() {
    const b = bar.querySelector('[data-act="doc"]'), rec = await linkGet();
    b.style.display = rec ? "" : "none";
    if (rec) b.title = "Overwrite the linked Word file “" + rec.name + "” with the current notes" + (rec.at ? " · last updated " + new Date(rec.at).toLocaleString() : "") + (rec.auto !== false ? " · auto-updates on changes" : "");
  }
  function docPending(on) { const b = bar.querySelector('[data-act="doc"]'); b.classList.toggle("ann-pending", on); if (on) b.textContent = "⟳ Update doc •"; }
  function docStatus(t) {
    const b = bar.querySelector('[data-act="doc"]'); b.textContent = t;
    clearTimeout(b._t); if (!/…$/.test(t)) b._t = setTimeout(() => { b.textContent = b.classList.contains("ann-pending") ? "⟳ Update doc •" : "⟳ Update doc"; updateDocBtn(); }, 2500);
  }
  function updateToolbar() {
    bar.querySelector("[data-count]").textContent = notes.length;
    bar.querySelector('[data-act="toggle"]').textContent = visible ? "Hide" : "Show";
    const hidden = notes.filter((n) => n.hidden).length;
    const un = bar.querySelector('[data-act="unhide"]');
    un.style.display = hidden ? "" : "none"; un.textContent = "Show hidden (" + hidden + ")";
  }

  bar.addEventListener("click", (e) => {
    const act = e.target.closest("button")?.dataset.act;
    if (act === "toggle") { visible = !visible; if (!visible && activeId) setActive(null, false); updateToolbar(); }
    if (act === "doc") updateLinked(true);
    if (act === "list") toggleList();
    if (act === "add") openEditor(null, null);
    if (act === "unhide") { notes.forEach((n) => { n.hidden = false; }); visible = true; save(); }
    if (act === "report") showReportMenu();
    if (act === "export") exportNotes();
    if (act === "import") bar.querySelector("input").click();
    if (act === "clear" && notes.length) confirmDelete(notes.map((n) => n.id), "Delete all " + notes.length + " notes on this page?").then((ok) => { if (ok) { notes.forEach((n) => shotDel(n.id)); dropCopies(notes.map((n) => n.id)); notes = []; save(); } });
  });
  bar.querySelector("input").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const r = await importData(JSON.parse(await f.text()));
      toast("Imported " + r.added + " note" + (r.added === 1 ? "" : "s") + (r.pages > 1 ? " on " + r.pages + " pages" : "") + (r.extras ? " + " + r.extras + " extra screenshot" + (r.extras === 1 ? "" : "s") : ""));
    } catch { alert("That file isn't a valid notes export."); }
    e.target.value = "";
  });

  // Merge an export into this site's notes. Full export: { pages: [{ page, notes, images }], extras, frd };
  // older one-page files go into this page. Notes already here are skipped. With `seen` (auto-import), ids in that
  // set are skipped too — so a note you deleted isn't brought back — and only new notes' screenshots are written.
  async function importData(data, seen) {
    const pagesIn = Array.isArray(data.pages) ? data.pages : [{ page: PAGE, notes: Array.isArray(data) ? data : data.notes, images: data.images }];
    if (!pagesIn.every((pg) => pg && Array.isArray(pg.notes))) throw new Error("bad export");
    let added = 0, extras = 0;
    for (const pg of pagesIn) {
      const page = pg.page || PAGE;
      let cur = page === PAGE ? notes : null;
      if (!cur) try { cur = JSON.parse(localStorage.getItem("annotator:" + page) || "[]"); } catch { cur = []; }
      const ids = new Set(cur.map((n) => n.id)), fresh = pg.notes.filter((n) => n && n.id && !ids.has(n.id) && !(seen && seen.has(n.id)));
      added += fresh.length;
      if (fresh.length) {
        if (page === PAGE) { notes = notes.concat(fresh); save(); }
        else try { localStorage.setItem("annotator:" + page, JSON.stringify(cur.concat(fresh))); } catch {}
      }
      const freshIds = new Set(fresh.map((n) => n.id));
      for (const [id, shot] of Object.entries(pg.images || {})) if (shot && shot.src && (!seen || freshIds.has(id))) await shotPutTo(page, id, shot);
    }
    for (const x of data.extras || []) if (x && x.id && x.src && !(seen && seen.has(x.id))) { await extraPut(x); extras++; }
    // Report fields: fill the ones not filled in here yet (your own edits are kept).
    if (data.frd && typeof data.frd === "object") saveMeta(Object.assign({}, data.frd, loadMeta()));
    if (added || extras) autoUpdateSoon();
    return { added, extras, pages: pagesIn.length };
  }

  // Auto-import: if `annotator-notes.js` sits next to annotator.js (an Export wrapped as
  // `window.__annotatorSeed = {…}` — a script, so it also loads from file://), its notes are merged in on load,
  // on every page at once. Each seed note/extra id is remembered (localStorage `annotator-seeded`) and never
  // imported twice, so deleting or moving a note sticks; a newer seed file only adds the notes that are new.
  function autoImport() {
    const src = (document.currentScript && document.currentScript.src) || [...document.scripts].map((s) => s.src).find((s) => /annotator\.js/.test(s)) || "./annotator.js";
    const s = document.createElement("script");
    s.src = src.replace(/annotator\.js(\?[^#]*)?$/, "annotator-notes.js") + "?t=" + Date.now();
    s.setAttribute("data-annotator-ui", "");
    s.onload = async () => {
      const data = window.__annotatorSeed; s.remove(); if (!data) return;
      let seen; try { seen = new Set(JSON.parse(localStorage.getItem("annotator-seeded") || "[]")); } catch { seen = new Set(); }
      try {
        const r = await importData(data, seen);
        (data.pages || []).forEach((pg) => (pg.notes || []).forEach((n) => n && n.id && seen.add(n.id)));
        (data.extras || []).forEach((x) => x && x.id && seen.add(x.id));
        try { localStorage.setItem("annotator-seeded", JSON.stringify([...seen])); } catch {}
        if (r.added || r.extras) { updateToolbar(); toast("Loaded " + r.added + " note" + (r.added === 1 ? "" : "s") + " from annotator-notes.js" + (r.pages > 1 ? " (" + r.pages + " pages)" : "")); }
      } catch {}
    };
    s.onerror = () => s.remove();
    document.head.appendChild(s);
  }
  autoImport();

  // ---------- picking (⌘/Ctrl + click) ----------
  const isMod = (e) => e.metaKey || e.ctrlKey;

  function setPicking(on) {
    modHeld = on;
    document.body.classList.toggle("ann-picking", on && !editor);
    if (!on) { hl.style.display = "none"; hoverEl = null; }
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Meta" || e.key === "Control") setPicking(true);
    if (e.key === "Escape" && document.querySelector(".ann-linkform")) return; // the link dialog handles its own Esc
    if (document.querySelector(".ann-confirm")) return; // so does the delete confirmation
    if (e.key === "Escape" && document.querySelector(".ann-hlpop")) { document.querySelector(".ann-hlpop").remove(); return; }
    if (e.key === "Escape" && editor && editor.box.classList.contains("ann-full")) { e.preventDefault(); editor.setFull(false); return; }
    const busy = editor || linking || reattach; // Esc closes those first; only a plain Esc clears the active note
    if (e.key === "Escape" && editor) closeEditor();
    if (e.key === "Escape" && linking) setLinking(null);
    if (e.key === "Escape" && reattach) setReattach(null);
    if (e.key === "Escape" && !busy && activeId) setActive(null, false);
  }, true);
  window.addEventListener("keyup", (e) => { if (e.key === "Meta" || e.key === "Control") setPicking(false); }, true);
  window.addEventListener("blur", () => setPicking(false));

  document.addEventListener("mousemove", (e) => {
    if (!isMod(e) || editor) { if (hoverEl) setPicking(false); return; }
    if (!modHeld) setPicking(true);
    const el = e.target;
    if (isOurs(el) || el === document.body || el === document.documentElement) { hl.style.display = "none"; hoverEl = null; return; }
    hoverEl = el;
    hl.classList.toggle("ann-hl-shot", e.shiftKey && !reattach); // ⌘⇧ = screenshot mode (green, dashed)
    const r = el.getBoundingClientRect();
    Object.assign(hl.style, { display: "block", left: r.left - 2 + "px", top: r.top - 2 + "px", width: r.width + 4 + "px", height: r.height + 4 + "px" });
  }, true);

  // Swallow the whole click sequence so the underlying button/link doesn't fire.
  const swallow = (e) => {
    if (!isMod(e) || isOurs(e.target)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
  };
  ["pointerdown", "mousedown", "pointerup", "mouseup", "auxclick"].forEach((t) => document.addEventListener(t, swallow, true));
  document.addEventListener("click", (e) => {
    if (!isMod(e) || isOurs(e.target)) return;
    swallow(e);
    const el = e.target;
    if (el === document.body || el === document.documentElement) return;
    if (reattach) { attachTo(reattach, el); return; }
    if (e.shiftKey) { shotToFR(el); return; }
    const existing = notes.find((n) => resolve(n) === el);
    openEditor(el, existing);
  }, true);

  // ---------- editor ----------
  function openEditor(el, note, focusNum) {
    closeEditor();
    setPicking(false);
    const box = document.createElement("div");
    box.className = "ann-editor"; box.setAttribute("data-annotator-ui", "");
    const label = !el ? (note && !note.manual ? "Element not on this screen — editing the text only" : "Added manually · not attached to an element") : el.tagName.toLowerCase() + (textOf(el) ? " · “" + textOf(el).slice(0, 40) + "”" : "");
    box.innerHTML = `<div class="ann-head"><label>No. <input class="ann-numin" maxlength="12"></label><div class="ann-target"></div>
        <button data-act="full" class="ann-fullbtn" title="Full screen (${/Mac/.test(navigator.platform) ? "⌘⇧" : "Ctrl+Shift+"}F) · Esc to exit"></button></div>
      ${el ? "" : `<div class="ann-quick"><span>Number as</span><button data-act="qmod" title="Next free module number">+ Module</button><button data-act="qfr" title="Next free FR number in the module you pick">+ FR in</button><select class="ann-qm" title="Module for the new FR"></select></div>`}
      <input class="ann-subin" maxlength="200" placeholder="Subtitle (optional) — shown under the title">
      <div class="ann-fmt"><select class="ann-font" title="Font of this note's box">${Object.entries(FONTS).map(([k, [l]]) => `<option value="${k}">${l}</option>`).join("")}</select>
        <select class="ann-size" title="Text size of this note's box">${SIZES.map((z) => `<option value="${z}">${z}px${z === 13 ? " (default)" : ""}</option>`).join("")}</select></div>
      <textarea placeholder="First line = title, then the description…&#10;“- ” starts a bullet · Tab / Shift+Tab = sub-bullet / back · 🔗 Link · 🖍 Highlight to flag a question."></textarea>
      <div class="ann-row">
        ${note ? '<button class="ann-danger" data-act="del">Delete</button>' : ""}
        <span class="ann-sp">${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+Enter to save</span>
        <button data-act="bold" class="ann-bold" title="Bold the selected text (${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl+"}B). Click again inside bold text to remove it."><b>B</b></button>
        <span class="ann-hlgrp"><button data-act="hl" title="Highlight the selected text — e.g. a question to check (${/Mac/.test(navigator.platform) ? "⌘⇧" : "Ctrl+Shift+"}H). Click again inside a highlight to remove it."><i class="ann-dot"></i>Highlight</button><button data-act="hlmenu" title="Highlight color · remove highlight">▾</button></span>
        <button data-act="link" title="Insert a link with its own title (${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+K)">🔗 Link</button>
        <button data-act="cancel">Cancel</button>
        <button class="ann-primary" data-act="save" title="${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+Enter">Save</button>
      </div>`;
    box.querySelector(".ann-target").textContent = label;
    const ta = box.querySelector("textarea");
    ta.value = note ? note.body : "";
    const numIn = box.querySelector(".ann-numin");
    numIn.placeholder = note ? String(notes.indexOf(note) + 1) : String(notes.length + 1);
    numIn.value = note && note.num != null ? note.num : "";
    numIn.title = "Leave blank to number automatically";
    const subIn = box.querySelector(".ann-subin");
    subIn.value = note && note.sub ? note.sub : "";
    // Font + size: this note's own, or (new note) the last ones picked. Previewed live in the text box.
    const fontSel = box.querySelector(".ann-font"), sizeSel = box.querySelector(".ann-size");
    const fmt0 = note ? { font: note.font, size: note.size } : lastFmt();
    fontSel.value = FONTS[fmt0.font] ? fmt0.font : "default";
    sizeSel.value = String(SIZES.includes(fmt0.size) ? fmt0.size : 13);
    const previewFmt = () => { ta.style.fontFamily = fontStack(fontSel.value); ta.style.fontSize = sizeSel.value + "px"; };
    [fontSel, sizeSel].forEach((sel) => sel.addEventListener("change", () => { previewFmt(); ta.focus(); }));
    previewFmt();
    // Full screen: the editor fills most of the window (for long notes); toggled by the ⤢ button or ⌘⇧F.
    const fullBtn = box.querySelector(".ann-fullbtn");
    const setFull = (on) => { box.classList.toggle("ann-full", on); fullBtn.textContent = on ? "⤡ Exit full screen" : "⤢ Full screen"; ta.focus(); };
    setFull(false);
    document.body.appendChild(box);
    if (!el) { // "+ Add": centred, with quick numbering (next module / next FR in a module)
      const nx = nextNums(), qm = box.querySelector(".ann-qm");
      qm.innerHTML = nx.mods.length ? nx.mods.map((m) => `<option value="${m}">${esc(modName(m))}</option>`).join("") : '<option value="1">M-1.0</option>';
      if (nx.mods.length) qm.value = String(nx.mods[nx.mods.length - 1]);
      box.querySelector('[data-act="qmod"]').textContent = "+ Module (" + modName(nx.nextMod) + ")";
      editor = { el: null, note, box, setFull, nx };
    }
    const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2 - 210, right: innerWidth / 2 + 210, top: Math.max(8, innerHeight / 2 - 160), bottom: 0, width: 0, height: 0 };
    const W = 420, H = box.offsetHeight;
    let left = el ? r.right + 14 : r.left, top = r.top;
    if (el && left + W > innerWidth - 8) left = r.left - W - 14;
    if (left < 8) { left = Math.max(8, Math.min(r.left, innerWidth - W - 8)); top = r.bottom + 10; }
    if (top + H > innerHeight - 8) top = Math.max(8, innerHeight - H - 8);
    Object.assign(box.style, { left: left + "px", top: Math.max(8, top) + "px" });

    if (el) {
      editor = { el, note, box, setFull };
      const ring = document.createElement("div");
      ring.className = "ann-hl"; ring.setAttribute("data-annotator-ui", "");
      Object.assign(ring.style, { left: r.left - 2 + "px", top: r.top - 2 + "px", width: r.width + 4 + "px", height: r.height + 4 + "px" });
      document.body.appendChild(ring);
      editor.ring = ring;
    }

    const commit = () => {
      const body = ta.value.trim();
      if (!body) {
        if (!note) { closeEditor(); return; }
        // Saving an existing note with its text cleared deletes it — ask first.
        confirmDelete([note.id]).then((ok) => { if (ok) { remove(note.id); closeEditor(); } else ta.focus(); });
        return;
      }
      const num = numIn.value.trim() || null;
      const font = fontSel.value === "default" ? undefined : fontSel.value, size = +sizeSel.value === 13 ? undefined : +sizeSel.value;
      setLastFmt(font, size);
      let saved = note;
      const sub = subIn.value.trim() || undefined;
      if (note) { note.body = body; note.num = num; note.sub = sub; note.font = font; note.size = size; }
      else {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const n = el ? { id, selector: selectorFor(el), tag: el.tagName.toLowerCase(), text: textOf(el), hint: hintOf(el), body, num, sub, font, size, links: [], dx: null, dy: null, created: new Date().toISOString() }
          : { id, manual: true, selector: "", tag: "", text: "", hint: "", body, num, sub, font, size, links: [], dx: null, dy: null, created: new Date().toISOString() };
        notes.push(n); if (el) cache.set(n.id, el); saved = n;
      }
      save(); visible = true; updateToolbar(); closeEditor();
      if (!el && !note) { toast("✓ " + (num || "Note") + " added — it's in All notes and the report"); if (list.classList.contains("open")) renderList(); return; }
      snapSoon(saved, 200); // after the callout has rendered, so the screenshot includes it
    };
    box.addEventListener("click", (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (act === "save") commit();
      if (act === "cancel") closeEditor();
      if (act === "link") { const r = e.target.closest("button").getBoundingClientRect(); editorLink(r.left, r.bottom + 6); }
      if (act === "hl") toggleHighlight();
      if (act === "hlmenu") hlMenu(e.target.closest("button"));
      if (act === "bold") toggleBold();
      if (act === "full") setFull(!box.classList.contains("ann-full"));
      if (act === "qmod") { numIn.value = modName(editor.nx.nextMod); ta.focus(); }
      if (act === "qfr") { numIn.value = editor.nx.nextFR(+box.querySelector(".ann-qm").value); ta.focus(); }
      if (act === "del") confirmDelete([note.id]).then((ok) => { if (ok) { remove(note.id); closeEditor(); } });
    });
    [ta, numIn, subIn].forEach((f) => f.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey || f !== ta)) { e.preventDefault(); commit(); } }));
    // Insert / edit a link at the cursor: prefilled from the link under the cursor, or the selected text as its title.
    const editorLink = (x, y) => {
      const s = ta.selectionStart, en = ta.selectionEnd, hit = linkAt(ta.value, s, en);
      linkForm(document, x, y, hit ? { title: hit.label, url: hit.url } : { title: ta.value.slice(s, en).trim(), url: "" }, (title, url) => {
        const before = ta.value;
        ta.value = applyLink(before, s, en, hit, title, url);
        const pos = (hit ? hit.start : s) + fmtLink(title, url).length;
        ta.focus(); ta.setSelectionRange(pos, pos);
      }, () => ta.focus());
    };
    // Highlight toggle: inside a highlight → remove it; otherwise highlight the selection (each selected line
    // separately, keeping "- " bullets outside), or the current line when nothing is selected. The color is the
    // one last picked in the ▾ menu (remembered).
    const dot = box.querySelector(".ann-dot");
    const paintDot = () => { dot.style.background = hlFill(hlColor()); };
    paintDot();
    // Highlights touching the selection (or containing the cursor).
    const hlsAt = (v, s, en) => { const out = []; let m; HL_RE.lastIndex = 0; while ((m = HL_RE.exec(v))) { const a = m.index, b = a + m[0].length; if (s === en ? s >= a && s <= b : s < b && en > a) out.push({ a, b, text: m[2] }); } return out; };
    // Replace highlights (right to left so earlier offsets stay valid) with plain text (color null) or re-colored.
    const rewrite = (hits, color) => {
      let v = ta.value, s0 = hits[0].a, e0 = hits[0].b;
      for (const h of hits.slice().reverse()) {
        const rep = color == null ? h.text : hlOpen(color) + h.text + "==";
        v = v.slice(0, h.a) + rep + v.slice(h.b);
        e0 = h === hits[hits.length - 1] ? h.a + rep.length : e0 + rep.length - (h.b - h.a);
      }
      ta.value = v; ta.focus(); ta.setSelectionRange(s0, Math.max(s0, e0));
    };
    const toggleHighlight = (color) => {
      const v = ta.value; let s = ta.selectionStart, en = ta.selectionEnd;
      const hits = hlsAt(v, s, en);
      if (hits.length && color == null) return rewrite(hits, null);      // button: inside a highlight → remove it
      if (hits.length && s === en) return rewrite(hits, color);          // color picked with the cursor in a highlight → re-color it
      if (hits.length) { rewrite(hits, null); s = ta.selectionStart; en = ta.selectionEnd; } // selection overlaps highlights → re-do as one color
      const v2 = ta.value;
      if (s === en) { s = v2.lastIndexOf("\n", s - 1) + 1; en = v2.indexOf("\n", en); if (en < 0) en = v2.length; }
      const open = hlOpen(color || hlColor());
      const wrapped = v2.slice(s, en).split("\n").map((line) => {
        const mm = line.match(/^(\s*(?:[-•*]\s+)?)(.*?)(\s*)$/);
        return mm[2] ? mm[1] + open + mm[2].replace(/==(\{[a-z]+\})?/g, "") + "==" + mm[3] : line;
      }).join("\n");
      ta.value = v2.slice(0, s) + wrapped + v2.slice(en);
      ta.focus(); ta.setSelectionRange(s, s + wrapped.length);
    };
    // Bold toggle: inside **bold** → unbold it; otherwise bold the selection (per line, bullets kept outside);
    // with nothing selected, insert **** and put the cursor in the middle.
    const toggleBold = () => {
      const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd; let m;
      BOLD_RE.lastIndex = 0;
      while ((m = BOLD_RE.exec(v))) {
        const a = m.index, b = a + m[0].length;
        if (s >= a && en <= b) { ta.value = v.slice(0, a) + m[1] + v.slice(b); ta.focus(); ta.setSelectionRange(a, a + m[1].length); return; }
      }
      if (s === en) { ta.value = v.slice(0, s) + "****" + v.slice(s); ta.focus(); ta.setSelectionRange(s + 2, s + 2); return; }
      const wrapped = v.slice(s, en).split("\n").map((line) => {
        const mm = line.match(/^(\s*(?:[-•]\s+|\*\s+)?)(.*?)(\s*)$/);
        return mm[2] ? mm[1] + "**" + mm[2].replace(/\*\*/g, "") + "**" + mm[3] : line;
      }).join("\n");
      ta.value = v.slice(0, s) + wrapped + v.slice(en);
      ta.focus(); ta.setSelectionRange(s, s + wrapped.length);
    };
    // Tab / Shift+Tab: indent / outdent the current or selected lines by one level (2 spaces) — turns a bullet into a sub-bullet.
    const indentLines = (dir) => {
      const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
      const a = v.lastIndexOf("\n", s - 1) + 1, bEnd = v.indexOf("\n", Math.max(s, en - (en > s && v[en - 1] === "\n" ? 1 : 0)));
      const b = bEnd < 0 ? v.length : bEnd;
      const lines = v.slice(a, b).split("\n");
      let first = 0, total = 0;
      const out = lines.map((l, i) => {
        if (dir > 0) { if (i === 0) first = 2; total += 2; return "  " + l; }
        const cut = l.startsWith("\t") ? 1 : Math.min(2, l.length - l.trimStart().length);
        if (i === 0) first = -cut; total -= cut; return l.slice(cut);
      }).join("\n");
      ta.value = v.slice(0, a) + out + v.slice(b);
      ta.setSelectionRange(Math.max(a, s + first), Math.max(a, en + total));
    };
    // Enter on a bullet line starts the next bullet at the same depth; Enter on an empty bullet ends the list.
    const continueBullet = (e) => {
      const v = ta.value, s = ta.selectionStart;
      if (s !== ta.selectionEnd) return;
      const a = v.lastIndexOf("\n", s - 1) + 1, line = v.slice(a, s);
      const m = line.match(/^([ \t]*)([-•]|\*(?!\*))(\s+)(.*)$/); if (!m) return;
      e.preventDefault();
      if (!m[4].trim()) { ta.value = v.slice(0, a) + v.slice(s); ta.setSelectionRange(a, a); return; }
      const ins = "\n" + m[1] + m[2] + " ";
      ta.value = v.slice(0, s) + ins + v.slice(s); ta.setSelectionRange(s + ins.length, s + ins.length);
    };
    const removeHighlight = () => {
      const hits = hlsAt(ta.value, ta.selectionStart, ta.selectionEnd);
      if (hits.length) rewrite(hits, null); else ta.focus();
    };
    // ▾ menu: pick a color (applies to the selection / the highlight under the cursor, and becomes the default) or remove.
    const hlMenu = (btn) => {
      const old = document.querySelector(".ann-hlpop"); if (old) { old.remove(); return; }
      const pop = document.createElement("div");
      pop.className = "ann-hlpop"; pop.setAttribute("data-annotator-ui", "");
      const hits = hlsAt(ta.value, ta.selectionStart, ta.selectionEnd);
      pop.innerHTML = `<div class="hh">Highlight color</div><div class="sw">${Object.keys(HL_COLORS).map((c) => `<button data-c="${c}" title="${c[0].toUpperCase() + c.slice(1)}" class="${c === hlColor() ? "on" : ""}" style="background:${hlFill(c)}"></button>`).join("")}</div>
        <button data-c="none" class="rm" ${hits.length ? "" : "disabled title='Put the cursor in a highlight, or select highlighted text'"}>✕ Remove highlight${hits.length > 1 ? "s (" + hits.length + ")" : ""}</button>`;
      pop.addEventListener("mousedown", (e) => e.preventDefault()); // keep the textarea's selection
      pop.addEventListener("click", (e) => {
        const c = e.target.closest("[data-c]")?.dataset.c; if (!c) return;
        if (c === "none") removeHighlight();
        else { setHlColor(c); paintDot(); toggleHighlight(c); }
        pop.remove();
      });
      document.body.appendChild(pop);
      const r = btn.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(r.right - pop.offsetWidth, innerWidth - pop.offsetWidth - 8)) + "px";
      pop.style.top = (r.bottom + 6 + pop.offsetHeight > innerHeight ? r.top - pop.offsetHeight - 6 : r.bottom + 6) + "px";
      const off = (e) => { if (!pop.contains(e.target) && !e.target.closest('[data-act="hlmenu"]')) { pop.remove(); document.removeEventListener("pointerdown", off, true); } };
      document.addEventListener("pointerdown", off, true);
    };
    ta.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); const r = ta.getBoundingClientRect(); editorLink(r.left, r.bottom + 6); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "h") { e.preventDefault(); toggleHighlight(); }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "b") { e.preventDefault(); toggleBold(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f") { e.preventDefault(); setFull(!box.classList.contains("ann-full")); }
      if (e.key === "Tab" && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); indentLines(e.shiftKey ? -1 : 1); }
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.isComposing) continueBullet(e);
    });
    setTimeout(() => (focusNum ? (numIn.focus(), numIn.select()) : ta.focus()), 0);
  }
  function closeEditor() {
    if (!editor) return;
    closeLinkUI(document);
    editor.box.remove(); editor.ring && editor.ring.remove(); document.querySelector(".ann-hlpop")?.remove();
    editor = null;
  }
  // Confirmation before deleting notes (a delete can't be undone). Resolves true when "Delete" is chosen.
  function confirmDelete(ids, heading) {
    const list = ids.map((id) => notes.find((n) => n.id === id)).filter(Boolean);
    if (!list.length) return Promise.resolve(false);
    return new Promise((done) => {
      const ov = document.createElement("div");
      ov.className = "ann-confirm"; ov.setAttribute("data-annotator-ui", "");
      const one = list.length === 1;
      ov.innerHTML = `<div class="cb" role="alertdialog" aria-modal="true"><h4></h4>
        <p>${one ? "This note" : "These notes"} and ${one ? "its" : "their"} screenshot${one ? "" : "s"} will be removed. This can't be undone — use Export first if you may need ${one ? "it" : "them"} later.</p>
        <ul></ul><div class="ca"><button data-c="no">Cancel</button><button data-c="yes" class="dz">Delete${one ? "" : " " + list.length}</button></div></div>`;
      ov.querySelector("h4").textContent = heading || (one ? "Delete note " + numOf(list[0], notes.indexOf(list[0])) + "?" : "Delete " + list.length + " notes?");
      const ul = ov.querySelector("ul");
      list.forEach((n) => { const li = document.createElement("li"), b = document.createElement("b"); b.textContent = numOf(n, notes.indexOf(n)); li.append(b, plainText(splitBody(n.body).title) || "(no title)"); ul.appendChild(li); });
      const close = (ok) => { document.removeEventListener("keydown", key, true); ov.remove(); done(ok); };
      const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(false); } else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); close(document.activeElement === ov.querySelector('[data-c="yes"]')); } };
      ov.addEventListener("pointerdown", (e) => e.stopPropagation());
      ov.addEventListener("click", (e) => { e.stopPropagation(); const c = e.target.closest("[data-c]")?.dataset.c; if (c) close(c === "yes"); else if (e.target === ov) close(false); });
      document.addEventListener("keydown", key, true);
      document.body.appendChild(ov);
      ov.querySelector('[data-c="no"]').focus(); // safe default: Enter cancels unless Delete is focused
    });
  }
  function remove(id) {
    shotDel(id); dropCopies([id]);
    extraAll().then((xs) => xs.filter((x) => x.note === id).forEach((x) => extraDel(x.id)));
    notes = notes.filter((n) => n.id !== id);
    notes.forEach((n) => { if (n.links) n.links = n.links.filter((t) => t !== id); });
    cache.delete(id); if (linking === id) setLinking(null); save();
  }

  // ---------- connections between notes ----------
  function setLinking(id) {
    linking = id;
    document.body.classList.toggle("ann-linking", !!id);
    banner.style.display = id ? "block" : "none";
    for (const [nid, v] of cards) v.card.classList.toggle("ann-src", nid === id);
  }
  function toggleLink(fromId, toId) {
    const a = notes.find((n) => n.id === fromId), b = notes.find((n) => n.id === toId);
    if (!a || !b || a === b) return;
    a.links = a.links || []; b.links = b.links || [];
    if (a.links.includes(toId)) a.links = a.links.filter((t) => t !== toId);
    else if (b.links.includes(fromId)) b.links = b.links.filter((t) => t !== fromId);
    else a.links.push(toId);
    save();
  }
  // Compare every number in the label in turn, so "FR-1.2" < "FR-1.10" < "FR-1.11" < "FR-2.1"; labels without digits go last.
  const numKey = (label) => (String(label).match(/\d+/g) || []).map(Number);
  const numCmp = (a, b) => {
    if (!a.length || !b.length) return (!a.length) - (!b.length);
    for (let j = 0; j < Math.max(a.length, b.length); j++) { const d = (a[j] ?? -1) - (b[j] ?? -1); if (d) return d; }
    return 0;
  };
  function ordered(list) {
    return list.map((n, i) => ({ n, i, k: numKey(numOf(n, i)), label: numOf(n, i) })).sort((a, b) => numCmp(a.k, b.k) || a.i - b.i);
  }
  document.addEventListener("pointerdown", (e) => { if (linking && !e.target.closest(".ann-card")) setLinking(null); }, true);

  // ---------- rendering callouts + arrows ----------
  const cards = new Map(); // id -> { card, path, ring }
  let activeId = null; // note picked in the All notes panel (or by clicking its box): element highlighted, box on top
  let drag = null;

  function ensure(note, i) {
    let v = cards.get(note.id);
    if (!v) {
      const card = document.createElement("div");
      card.className = "ann-card";
      card.innerHTML = `<span class="ann-num"></span><span class="ann-body"></span>
        <span class="ann-acts"><button data-act="link" title="Connect this note to another one">Connect →</button><button data-act="edit">Edit</button><button data-act="hide" title="Hide this box (click its pin to show it again)">Hide</button><button data-act="del">✕</button></span>`;
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("fill", "none"); path.setAttribute("stroke", ACCENT); path.setAttribute("stroke-width", "2");
      path.setAttribute("marker-end", "url(#ann-arrow)");
      const ring = document.createElement("div"); ring.className = "ann-ring";
      const pin = document.createElement("div"); pin.className = "ann-pin";
      pin.addEventListener("click", () => { const n = notes.find((x) => x.id === note.id); if (n) { n.hidden = false; save(); } });
      svg.appendChild(path); layer.appendChild(ring); layer.appendChild(pin); layer.appendChild(card);
      if (note.w) card.style.width = note.w + "px";
      if (note.h) card.style.height = note.h + "px";
      v = { card, path, ring, pin };
      cards.set(note.id, v);

      // Persist manual box resizes (drag from the bottom-right corner) per note.
      if (window.ResizeObserver) {
        let saveTimer = null;
        new ResizeObserver(() => {
          const n = notes.find((x) => x.id === note.id); if (!n || !card.offsetWidth) return; // 0×0 = box hidden, not resized
          if (n.w === card.offsetWidth && n.h === card.offsetHeight) return;
          const resized = n.w != null;
          n.w = card.offsetWidth; n.h = card.offsetHeight;
          clearTimeout(saveTimer); saveTimer = setTimeout(save, 250);
          if (resized) snapSoon(n);
        }).observe(card);
      }

      card.addEventListener("click", (e) => {
        const act = e.target.closest("button")?.dataset.act;
        const n = notes.find((x) => x.id === note.id);
        if (!n) return;
        if (linking && !act) { if (linking !== n.id) toggleLink(linking, n.id); setLinking(null); return; }
        if (!act && activeId !== n.id) setActive(n.id, false);
        if (act === "link") { setLinking(linking === n.id ? null : n.id); return; }
        if (e.target.closest(".ann-num")) { const el = resolve(n); if (el) openEditor(el, n, true); return; }
        if (act === "del") { confirmDelete([n.id]).then((ok) => ok && remove(n.id)); return; }
        if (act === "hide") { n.hidden = true; if (activeId === n.id) setActive(null, false); save(); }
        if (act === "edit") { const el = resolve(n); if (el) openEditor(el, n); }
      });
      card.addEventListener("dblclick", () => { const n = notes.find((x) => x.id === note.id); const el = n && resolve(n); if (el) openEditor(el, n); });
      card.addEventListener("pointerdown", (e) => {
        if (e.target.closest("button, .ann-num, a") || linking) return;
        // Bottom-right corner is the native resize handle — let the browser handle it, don't start a drag.
        const cr = card.getBoundingClientRect();
        if (e.clientX > cr.right - 16 && e.clientY > cr.bottom - 16) return;
        const n = notes.find((x) => x.id === note.id); const el = n && resolve(n); if (!el) return;
        const r = el.getBoundingClientRect();
        drag = { n, r, sx: e.clientX, sy: e.clientY, dx0: card.offsetLeft - r.right, dy0: card.offsetTop - r.top };
        card.setPointerCapture(e.pointerId); e.preventDefault();
      });
      card.addEventListener("pointermove", (e) => {
        if (!drag || drag.n.id !== note.id) return;
        drag.n.dx = drag.dx0 + e.clientX - drag.sx;
        drag.n.dy = drag.dy0 + e.clientY - drag.sy;
      });
      card.addEventListener("pointerup", () => {
        if (!drag || drag.n.id !== note.id) return;
        const moved = drag.n.dx !== drag.dx0 || drag.n.dy !== drag.dy0, n = drag.n;
        drag = null; save();
        if (moved) snapSoon(n); // keep the screenshot matching where the box now sits
      });
    }
    v.card.querySelector(".ann-num").textContent = numOf(note, i);
    v.pin.textContent = numOf(note, i);
    v.pin.title = "Show note " + numOf(note, i) + ": " + note.body.slice(0, 80);
    const fmt = (note.font || "") + "|" + (note.size || "");
    if (v.fmt !== fmt) { v.fmt = fmt; v.card.style.fontFamily = fontStack(note.font); v.card.style.fontSize = note.size ? note.size + "px" : ""; }
    if (v.body !== note.body + "\n\u0000" + (note.sub || "")) { v.body = note.body + "\n\u0000" + (note.sub || ""); v.card.querySelector(".ann-body").innerHTML = cardHTML(note.body, note.sub); } // only when changed, so chips stay clickable
    return v;
  }

  // Arrow from nearest card edge to nearest point on the element's border (shared with screenshots).
  function arrowGeom(r, x, y, cw, ch) {
    const cx = x + cw / 2, cy = y + ch / 2;
    const tx = Math.max(r.left, Math.min(cx, r.right)), ty = Math.max(r.top, Math.min(cy, r.bottom));
    const inside = cx > r.left && cx < r.right && cy > r.top && cy < r.bottom;
    const ex = inside ? r.left + r.width / 2 : tx, ey = inside ? r.top : ty;
    const sx = Math.max(x, Math.min(ex, x + cw)), sy = Math.max(y, Math.min(ey, y + ch));
    return { sx, sy, mx: (sx + ex) / 2, my: (sy + ey) / 2 - 18, ex, ey };
  }

  const links = new Map(); // "from>to" -> { hit, path }
  function edgePoint(b, tx, ty) {
    // Point where the line from b's centre toward (tx,ty) leaves box b.
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = tx - cx, dy = ty - cy;
    if (!dx && !dy) return [cx, cy];
    const s = Math.min(dx ? (b.w / 2) / Math.abs(dx) : Infinity, dy ? (b.h / 2) / Math.abs(dy) : Infinity);
    return [cx + dx * s, cy + dy * s];
  }

  // Is the element hidden behind something else — e.g. a modal's overlay, or a sticky header it scrolled under?
  // Then its box/arrow/pin are hidden too, so boxes of the page behind an open modal don't pile on top of the
  // modal and bury the modal's own boxes. Checked by hit-testing a few points of the element (throttled).
  const coverCache = new Map(); // id -> { t, el, covered }
  function isCovered(id, el, r) {
    const now = performance.now(), c = coverCache.get(id);
    if (c && c.el === el && now - c.t < 150) return c.covered;
    const covered = coveredAt(el, r);
    coverCache.set(id, { t: now, el, covered });
    return covered;
  }
  function coveredAt(el, r) {
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    const pts = [[0.5, 0.5], [0.2, 0.25], [0.8, 0.25], [0.2, 0.75], [0.8, 0.75]]
      .map(([fx, fy]) => [r.left + r.width * fx, r.top + r.height * fy])
      .filter(([x, y]) => x >= 0 && y >= 0 && x < vw && y < vh);
    for (const [x, y] of pts) {
      const hit = document.elementsFromPoint(x, y).find((n) => !isOurs(n));
      if (!hit || hit === el || el.contains(hit) || hit.contains(el)) return false;
    }
    return pts.length > 0;
  }

  function tick() {
    const live = new Set();
    const boxes = new Map();
    notes.forEach((note, i) => {
      live.add(note.id);
      const v = ensure(note, i);
      // The active note is shown even if it's hidden (pin) or all boxes are hidden — only while it stays active,
      // so deselecting it (Esc, clicking its row again, closing the panel) puts it back the way it was.
      const act = note.id === activeId, hid = note.hidden && !act;
      const el = visible || act ? resolve(note) : null;
      const r = el && el.getBoundingClientRect();
      const onScreen = r && (r.width || r.height) && r.bottom > -40 && r.top < innerHeight + 40 && !isCovered(note.id, el, r);
      const shown = onScreen && !hid;
      v.card.style.display = v.ring.style.display = shown ? "" : "none";
      v.card.classList.toggle("ann-active", note.id === activeId); v.ring.classList.toggle("ann-active", note.id === activeId);
      // The panel sits on the right: while the active element is in the right half, move it left so it doesn't cover it.
      if (note.id === activeId && r) list.classList.toggle("ann-left", r.left + r.width / 2 > innerWidth / 2);
      v.path.style.display = shown ? "" : "none";
      v.pin.style.display = onScreen && hid ? "" : "none";
      if (onScreen && hid) Object.assign(v.pin.style, { left: Math.max(2, r.left - 9) + "px", top: Math.max(2, r.top - 9) + "px" });
      if (!shown) return;

      Object.assign(v.ring.style, { left: r.left - 3 + "px", top: r.top - 3 + "px", width: r.width + 6 + "px", height: r.height + 6 + "px" });

      const cw = v.card.offsetWidth, ch = v.card.offsetHeight;
      let x, y;
      if (note.dx != null) { x = r.right + note.dx; y = r.top + note.dy; }
      else {
        // Default placement: to the right, else left, else below.
        x = r.right + 40; y = r.top - ch - 16;
        if (x + cw > innerWidth - 8) x = r.left - cw - 40;
        if (x < 8) { x = Math.min(Math.max(8, r.left), innerWidth - cw - 8); y = r.bottom + 30; }
        if (y < 8) y = r.bottom + 30;
        // Don't land on top of a box already placed this frame (e.g. two notes on neighbouring lines):
        // move down past it, or up if that would leave the screen. Dragged boxes keep their spot.
        for (let tries = 0; tries < 12; tries++) {
          const hit = [...boxes.values()].find((b) => x < b.x + b.w + 8 && x + cw + 8 > b.x && y < b.y + b.h + 8 && y + ch + 8 > b.y);
          if (!hit) break;
          y = hit.y + hit.h + 10 + ch > innerHeight - 8 && hit.y - ch - 10 > 8 ? hit.y - ch - 10 : hit.y + hit.h + 10;
        }
      }
      v.card.style.left = x + "px"; v.card.style.top = y + "px";
      boxes.set(note.id, { x, y, w: cw, h: ch });

      const { sx, sy, mx, my, ex, ey } = arrowGeom(r, x, y, cw, ch);
      v.path.setAttribute("d", `M${sx},${sy} Q${mx},${my} ${ex},${ey}`);
      v.path.style.display = Math.hypot(ex - sx, ey - sy) < 6 ? "none" : "";
    });
    for (const [id, v] of cards) if (!live.has(id)) { v.card.remove(); v.path.remove(); v.ring.remove(); v.pin.remove(); cards.delete(id); }

    // Card-to-card connectors (dashed arrows).
    const liveLinks = new Set();
    notes.forEach((a) => (a.links || []).forEach((toId) => {
      const k = a.id + ">" + toId; liveLinks.add(k);
      let l = links.get(k);
      if (!l) {
        const hit = document.createElementNS(svgNS, "path");
        hit.setAttribute("class", "ann-link-hit"); hit.setAttribute("fill", "none");
        hit.setAttribute("stroke", "transparent"); hit.setAttribute("stroke-width", "12");
        const t = document.createElementNS(svgNS, "title"); t.textContent = "Click to remove this connection"; hit.appendChild(t);
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("class", "ann-link"); path.setAttribute("fill", "none"); path.setAttribute("stroke", ACCENT);
        path.setAttribute("stroke-width", "2"); path.setAttribute("stroke-dasharray", "6 4"); path.setAttribute("marker-end", "url(#ann-arrow)");
        hit.addEventListener("click", () => {
          const from = notes.find((n) => n.id === a.id);
          if (from && confirm("Remove this connection?")) { from.links = (from.links || []).filter((x) => x !== toId); save(); }
        });
        svg.appendChild(hit); svg.appendChild(path);
        l = { hit, path }; links.set(k, l);
      }
      const A = boxes.get(a.id), B = boxes.get(toId);
      const on = A && B && cards.get(a.id).card.style.display !== "none" && cards.get(toId).card.style.display !== "none";
      l.hit.style.display = l.path.style.display = on ? "" : "none";
      if (!on) return;
      const [sx, sy] = edgePoint(A, B.x + B.w / 2, B.y + B.h / 2);
      const [ex, ey] = edgePoint(B, A.x + A.w / 2, A.y + A.h / 2);
      // Gentle bend perpendicular to the line so overlapping connectors stay readable.
      const len = Math.hypot(ex - sx, ey - sy) || 1, bend = Math.min(40, len * 0.15);
      const mx = (sx + ex) / 2 - ((ey - sy) / len) * bend, my = (sy + ey) / 2 + ((ex - sx) / len) * bend;
      const d = `M${sx},${sy} Q${mx},${my} ${ex},${ey}`;
      l.hit.setAttribute("d", d); l.path.setAttribute("d", d);
    }));
    for (const [k, l] of links) if (!liveLinks.has(k)) { l.hit.remove(); l.path.remove(); links.delete(k); }

    if (editor && editor.ring && editor.el.isConnected) {
      const r = editor.el.getBoundingClientRect();
      Object.assign(editor.ring.style, { left: r.left - 2 + "px", top: r.top - 2 + "px", width: r.width + 4 + "px", height: r.height + 4 + "px" });
    }
    requestAnimationFrame(tick);
  }

  // ---------- screenshots (IndexedDB, keyed "<page>:<note id>") ----------
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      const q = indexedDB.open("annotator", 1);
      q.onupgradeneeded = () => q.result.createObjectStore("shots");
      q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
    });
    return dbp;
  }
  async function idb(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction("shots", mode), q = fn(t.objectStore("shots"));
      t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error);
    });
  }
  const shotGet = (page, id) => idb("readonly", (st) => st.get(page + ":" + id)).catch(() => null);
  const shotPutTo = (page, id, shot) => idb("readwrite", (st) => st.put(shot, page + ":" + id)).catch(() => {});
  const shotPut = (id, shot) => shotPutTo(PAGE, id, shot);
  const shotDel = (id) => idb("readwrite", (st) => st.delete(PAGE + ":" + id)).catch(() => {});

  // Extra screenshots (⌘⇧-click): not notes — they only show in the report / PDF / Word, under the FR they were
  // added to. Stored as "__extra:<id>" → { id, page, note, src, w, h, caption, at } (page + note id = that FR).
  const EXTRA = "__extra:";
  const extraAll = () => idb("readonly", (st) => st.getAll(IDBKeyRange.bound(EXTRA, EXTRA + "\uffff"))).then((r) => r || []).catch(() => []);
  const extraPut = (x) => idb("readwrite", (st) => st.put(x, EXTRA + x.id)).catch(() => {});
  const extraDel = (id) => idb("readwrite", (st) => st.delete(EXTRA + id)).catch(() => {});
  // Standard size for extra screenshots in the report / PDF / Word: fit inside 560 × 380 px, aspect ratio kept,
  // never larger than the captured pixels.
  const XBOX = { w: 560, h: 380 };
  const extraSize = (x) => { const f = Math.min(1, XBOX.w / x.w, XBOX.h / x.h); return { w: Math.round(x.w * f), h: Math.round(x.h * f) }; };

  // ---------- linked Word file (overwritten in place instead of downloading new copies) ----------
  // The file handle lives in IndexedDB (shared by every page on the site); Chrome/Edge only.
  const LINK_KEY = "__linked-docx";
  const linkGet = () => idb("readonly", (st) => st.get(LINK_KEY)).catch(() => null);
  const linkPut = (rec) => idb("readwrite", (st) => st.put(rec, LINK_KEY)).catch(() => {});
  const linkDel = () => idb("readwrite", (st) => st.delete(LINK_KEY)).catch(() => {});
  async function ensurePerm(handle, ask) {
    const o = { mode: "readwrite" };
    if ((await handle.queryPermission(o)) === "granted") return true;
    return ask ? (await handle.requestPermission(o)) === "granted" : false;
  }
  async function writeBlob(handle, blob) { const wr = await handle.createWritable(); await wr.write(blob); await wr.close(); }
  // Rebuild the Word file from the stored notes and overwrite the linked file. ask=true may show Chrome's permission prompt.
  let docBusy = false, docAgain = false, docTimer = null;
  async function updateLinked(ask) {
    if (docBusy) { docAgain = true; return; }
    const rec = await linkGet(); if (!rec) return;
    if (!(await ensurePerm(rec.handle, ask))) { docPending(true); return; }
    docBusy = true; docStatus("Updating…");
    try {
      const all = annotatedPages(), pages = rec.scope === "all" ? all : all.filter((p) => p.page === (rec.page || PAGE));
      if (!pages.length) { docStatus("No notes"); return; }
      const { groups, val } = await collectReport(pages, () => {}, ask, rec.mod ?? null);
      if (!groups.length) { docStatus("No notes"); return; }
      await writeBlob(rec.handle, await buildDocx({ val, groups, hlOn: rec.hlOn !== false }));
      rec.at = new Date().toISOString(); await linkPut(rec);
      docPending(false); docStatus("✓ Doc updated");
    } catch (err) { docStatus("Doc update failed"); console.warn("[annotator] linked file:", err); }
    finally { docBusy = false; if (docAgain) { docAgain = false; autoUpdateSoon(); } }
  }
  // Called whenever notes / screenshots / report fields change.
  function autoUpdateSoon() {
    clearTimeout(docTimer);
    docTimer = setTimeout(async () => { const rec = await linkGet(); if (rec && rec.auto !== false) updateLinked(false); }, 3000);
  }

  const libs = {};
  function loadLib(url, global) {
    if (window[global]) return Promise.resolve(window[global]);
    return libs[url] || (libs[url] = new Promise((res, rej) => {
      const sc = document.createElement("script");
      sc.src = url; sc.setAttribute("data-annotator-ui", "");
      sc.onload = () => (window[global] ? res(window[global]) : rej(new Error(global + " missing")));
      sc.onerror = () => { delete libs[url]; rej(new Error("Couldn't load " + url)); };
      document.head.appendChild(sc);
    }));
  }

  // Screenshot of the element and its callout box exactly as shown on the page: the page is rendered without the
  // annotator UI, then the real card (rendered on its own), its dashed outline and its arrow are drawn at the same spots.
  const SHOT_V = 6; // bump when screenshots need retaking (v2: fixed shift on scrolled pages, v3: modals mid-animation, v4: modals on scrolled pages came out blank, v5: inline-flex tab bars hid their tabs, v6: cropped to the element + callout, no empty band below)
  // html2canvas renders a copy of the page, where CSS animations start over — a modal with a pop-in/slide-in
  // animation would be captured mid-animation (shifted/scaled) while the outline is placed where it really is.
  // Freeze the copy in its final, settled state.
  function markFixed() {
    const out = [], all = document.body.getElementsByTagName("*");
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      if (isOurs(el) || getComputedStyle(el).position !== "fixed") continue;
      el.setAttribute("data-ann-fx", out.length);
      out.push({ el, r: el.getBoundingClientRect() });
    }
    return out;
  }
  function pinFixed(doc, fixed) {
    const win = doc.defaultView;
    fixed.forEach(({ r }, i) => { // outer ones first (document order), so inner ones can be placed relative to them
      const c = doc.querySelector('[data-ann-fx="' + i + '"]'); if (!c) return;
      const set = (k, v) => c.style.setProperty(k, v, "important");
      set("position", "absolute"); set("right", "auto"); set("bottom", "auto"); set("margin", "0"); set("transform", "none");
      set("width", r.width + "px"); set("height", r.height + "px"); set("box-sizing", "border-box");
      const op = c.offsetParent;
      let ox = 0, oy = 0;
      if (op && op !== doc.body && win.getComputedStyle(op).position !== "static") {
        const orc = op.getBoundingClientRect();
        ox = orc.left + win.scrollX + op.clientLeft - op.scrollLeft;
        oy = orc.top + win.scrollY + op.clientTop - op.scrollTop;
      }
      set("left", r.left + scrollX - ox + "px"); set("top", r.top + scrollY - oy + "px");
    });
  }
  function freezeClone(doc) {
    const st = doc.createElement("style");
    st.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}";
    (doc.head || doc.documentElement).appendChild(st);
    fixInlineFlex(doc);
  }
  // html2canvas paints a display:inline-flex / inline-grid box's own background ON TOP of its children, so a
  // pill tab bar (All / My / Joined Stores, Pro / Sideline Stock) comes out as an empty grey bar with the
  // labels and selected pill hidden. An imperceptible opacity makes it paint the box first, then its children.
  function fixInlineFlex(doc) {
    const win = doc.defaultView, all = doc.body ? doc.body.getElementsByTagName("*") : [];
    for (let i = 0; i < all.length; i++) {
      const el = all[i], cs = win.getComputedStyle(el);
      if ((cs.display === "inline-flex" || cs.display === "inline-grid") && cs.opacity === "1") el.style.setProperty("opacity", "0.999", "important");
    }
  }
  // tight = just the element (+ a small margin), for ⌘⇧-click screenshots; otherwise the element with its surroundings.
  async function capture(el, note, tight) {
    const h2c = await loadLib(H2C_URL, "html2canvas");
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) return null; // off screen: nothing to capture
    const v = note && cards.get(note.id);
    const cardOn = !!(v && visible && !note.hidden && v.card.style.display !== "none" && v.card.offsetWidth);
    const cr = cardOn ? v.card.getBoundingClientRect() : null;
    let L = r.left - 6, T = r.top - 6, R = r.right + 6, B = r.bottom + 6;
    if (cr) { L = Math.min(L, cr.left); T = Math.min(T, cr.top); R = Math.max(R, cr.right); B = Math.max(B, cr.bottom); }
    // Width keeps some context (min 760px); height is just the element + callout + a small margin (no empty band).
    let w = Math.min(vw, Math.max(R - L + 80, 760)), h = Math.min(vh, B - T + 48);
    let x = Math.max(0, Math.min((L + R) / 2 - w / 2, vw - w));
    let y = Math.max(0, Math.min((T + B) / 2 - h / 2, vh - h));
    if (tight) { // clipped to what's on screen
      x = Math.max(0, r.left - 8); y = Math.max(0, r.top - 8);
      w = Math.min(vw, r.right + 8) - x; h = Math.min(vh, r.bottom + 8) - y;
    }
    const scale = Math.min(2, devicePixelRatio || 1);
    // x/y are document coordinates; scrollX/scrollY:0 stops html2canvas from applying the page scroll a second time
    // (otherwise any scrolled page comes out shifted and the outline/arrow miss the element).
    // Elements pinned to the screen (position:fixed — modals, overlays, toolbars) are drawn by html2canvas as if
    // the page weren't scrolled, while everything else is drawn scrolled — so on a scrolled page a modal ends up
    // far from where it's seen (the screenshot came out blank). Mark them, and in the copy re-place each one at
    // exactly where it's seen on screen, in page coordinates.
    const fixed = markFixed();
    let page;
    try {
      page = await h2c(document.body, {
      onclone: (doc) => {
        freezeClone(doc);
        if (!scrollX && !scrollY) return;
        // Modals often set body{overflow:hidden} (with body only one screen tall) to stop the page scrolling;
        // html2canvas then clips everything below the first screen, so a scrolled page renders blank.
        [doc.documentElement, doc.body].forEach((n) => n.style.setProperty("overflow", "visible", "important"));
        pinFixed(doc, fixed);
      },
      x: x + scrollX, y: y + scrollY, width: w, height: h, scale, scrollX: 0, scrollY: 0,
      useCORS: true, logging: false, backgroundColor: "#ffffff",
      ignoreElements: (n) => n.nodeType === 1 && n.hasAttribute("data-annotator-ui"),
      });
    } finally { fixed.forEach((f) => f.el.removeAttribute("data-ann-fx")); }
    let cardImg = null;
    if (cardOn) {
      v.card.classList.add("ann-snapping"); // hides the hover buttons + resize grip while rendering
      try { cardImg = await h2c(v.card, { scale, useCORS: true, logging: false, backgroundColor: null, onclone: freezeClone }); } catch {}
      v.card.classList.remove("ann-snapping");
    }
    const s = page.width / w, k = Math.min(1, 1400 / page.width), f = s * k;
    const out = document.createElement("canvas");
    out.width = Math.round(page.width * k); out.height = Math.round(page.height * k);
    const ctx = out.getContext("2d");
    ctx.drawImage(page, 0, 0, out.width, out.height);
    const box = { x: (r.left - x) * f, y: (r.top - y) * f, w: r.width * f, h: r.height * f };
    if (!cardImg) return { src: out.toDataURL("image/jpeg", 0.88), w: out.width, h: out.height, box, at: new Date().toISOString() };

    const X = (px) => (px - x) * f, Y = (py) => (py - y) * f;
    // Dashed outline (same as .ann-ring: 3px outside the element, 2px dashed).
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2 * f; ctx.setLineDash([6 * f, 4 * f]);
    ctx.beginPath();
    (ctx.roundRect ? ctx.roundRect.bind(ctx) : ctx.rect.bind(ctx))(X(r.left - 2), Y(r.top - 2), (r.width + 4) * f, (r.height + 4) * f, 4 * f);
    ctx.stroke(); ctx.setLineDash([]);
    // Arrow (same curve + arrowhead as the on-page SVG).
    const g = arrowGeom(r, cr.left, cr.top, cr.width, cr.height);
    if (Math.hypot(g.ex - g.sx, g.ey - g.sy) >= 6) {
      ctx.lineWidth = 2 * f; ctx.beginPath(); ctx.moveTo(X(g.sx), Y(g.sy)); ctx.quadraticCurveTo(X(g.mx), Y(g.my), X(g.ex), Y(g.ey)); ctx.stroke();
      const a = Math.atan2(g.ey - g.my, g.ex - g.mx), len = 14 * f, half = 7 * f;
      ctx.fillStyle = ACCENT; ctx.beginPath();
      ctx.moveTo(X(g.ex), Y(g.ey));
      ctx.lineTo(X(g.ex) - len * Math.cos(a) + half * Math.sin(a), Y(g.ey) - len * Math.sin(a) - half * Math.cos(a));
      ctx.lineTo(X(g.ex) - len * Math.cos(a) - half * Math.sin(a), Y(g.ey) - len * Math.sin(a) + half * Math.cos(a));
      ctx.closePath(); ctx.fill();
    }
    // The real callout box, with its shadow.
    ctx.save(); ctx.shadowColor = "rgba(20,20,40,.18)"; ctx.shadowBlur = 20 * f; ctx.shadowOffsetY = 6 * f;
    ctx.drawImage(cardImg, X(cr.left), Y(cr.top), cr.width * f, cr.height * f);
    ctx.restore();
    return { src: out.toDataURL("image/jpeg", 0.9), w: out.width, h: out.height, box, card: true, v: SHOT_V, at: new Date().toISOString() };
  }
  const snapTimers = new Map();
  function snapSoon(note, delay = 600) {
    clearTimeout(snapTimers.get(note.id));
    snapTimers.set(note.id, setTimeout(() => { snapTimers.delete(note.id); if (notes.includes(note)) snap(note); }, delay));
  }
  async function snap(note) {
    const el = note && resolve(note);
    if (!el) return null;
    try { const shot = await capture(el, note); if (shot) { await shotPut(note.id, shot); autoUpdateSoon(); } return shot; }
    catch (err) { console.warn("[annotator] screenshot failed:", err); return null; }
  }

  // Everything, so nothing is left behind: every annotated page's notes + screenshots, the extra (⌘⇧) screenshots
  // and the report's fields (header, versions, sections, phased-in, references).
  async function exportNotes() {
    const pages = [];
    for (const pg of annotatedPages()) {
      const images = {};
      for (const n of pg.notes) { const shot = await shotGet(pg.page, n.id); if (shot) images[n.id] = shot; }
      pages.push({ page: pg.page, notes: pg.notes, images });
    }
    const extras = await extraAll();
    if (!pages.length && !extras.length) { alert("There are no notes to export yet."); return; }
    const data = { version: 2, exported: new Date().toISOString(), pages, extras, frd: loadMeta() };
    const total = pages.reduce((t, p) => t + p.notes.length, 0);
    download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), "Annotator notes - all pages - " + new Date().toISOString().slice(0, 10) + ".json");
    toast("Exported " + total + " note" + (total === 1 ? "" : "s") + " on " + pages.length + " page" + (pages.length === 1 ? "" : "s") + (extras.length ? " + " + extras.length + " extra screenshot" + (extras.length === 1 ? "" : "s") : ""));
  }
  function toast(t) {
    document.querySelector(".ann-toast")?.remove();
    const el = document.createElement("div"); el.className = "ann-toast"; el.setAttribute("data-annotator-ui", ""); el.textContent = t;
    document.body.appendChild(el); setTimeout(() => el.remove(), 3200);
  }

  // ⌘⇧-click: screenshot just that element and choose the module + FR it belongs to. It's not a note on the page —
  // it only appears in the report / PDF / Word, under that FR.
  // Every FR a ⌘⇧ screenshot can go under, grouped by module: value "page\nid" → { v, fr, title, page }.
  function frChoices() {
    const pages = annotatedPages(), mods = modulesIn(pages);
    const byMod = new Map(mods.map(({ m }) => [m, []]));
    const rn = frRenumber().map; // same numbers as the report (duplicates numbered on)
    uniquePages(pages).forEach((pg) => frItems(pg).forEach((x) => { const m = modOf(x.fr); if (byMod.has(m)) byMod.get(m).push({ v: pg.page + "\n" + x.n.id, fr: rn.get(x.n.id) || x.fr, title: plainText(splitBody(x.n.body).title), page: pg.page }); }));
    return { pages, mods, byMod };
  }
  async function shotToFR(el) {
    setPicking(false);
    const { pages, mods, byMod } = frChoices();
    if (!mods.length) { alert("Add a note first (" + (/Mac/.test(navigator.platform) ? "⌘" : "Ctrl") + "+click) — extra screenshots are added to one of its FRs."); return; }
    let shot = null;
    try { shot = await capture(el, null, true); } catch (err) { console.warn("[annotator] screenshot failed:", err); }
    if (!shot) { alert("Couldn't take that screenshot — scroll the element onto the screen and try again."); return; }
    let last = {}; try { last = JSON.parse(localStorage.getItem("annotator-shotto")) || {}; } catch {}
    const ov = document.createElement("div");
    ov.className = "ann-confirm ann-shotpick"; ov.setAttribute("data-annotator-ui", "");
    ov.innerHTML = `<div class="cb" role="dialog" aria-modal="true"><h4>Add screenshot to the report</h4>
      <p>It's added under the FR you pick — in the report, PDF and Word only (not as a note on the page).</p>
      <img class="pv" alt="">
      <label class="fl"><span>Module</span><select data-m>${mods.map(({ m, frs }) => `<option value="${m}">${esc(modName(m))} (${frs.length} FR${frs.length === 1 ? "" : "s"})</option>`).join("")}</select></label>
      <label class="fl"><span>FR</span><select data-f></select></label>
      <label class="fl"><span>No.</span><b data-no></b></label>
      <label class="fl fl-top"><span>Caption</span><textarea data-c rows="4" maxlength="4000" placeholder="Optional. First line next to the FR, e.g. “Size dropdown open”&#10;- “- ” starts a bullet · Tab = sub-bullet&#10;${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+Enter to add"></textarea></label>
      <div class="ca"><button data-a="no">Cancel</button><button class="pr" data-a="yes">Add to FR</button></div></div>`;
    ov.querySelector(".pv").src = shot.src;
    const mSel = ov.querySelector("[data-m]"), fSel = ov.querySelector("[data-f]"), cap = ov.querySelector("[data-c]");
    bulletKeys(cap);
    // Number this screenshot will get: the FR + the next sub-number (FR-1.7 → FR-1.7.1, FR-1.7.2 …).
    const xCount = new Map(); (await extraAll()).forEach((x) => { const v = x.page + "\n" + x.note; xCount.set(v, (xCount.get(v) || 0) + 1); });
    const showNo = () => { const o = byMod.get(+mSel.value).find((o) => o.v === fSel.value); ov.querySelector("[data-no]").textContent = o ? xNo(o.fr, xCount.get(o.v) || 0) : ""; };
    fSel.onchange = showNo;
    const fillFR = () => {
      fSel.innerHTML = byMod.get(+mSel.value).map((o) => `<option value="${esc(o.v)}">${esc(o.fr)} — ${esc(o.title || "(no title)")}${pages.length > 1 ? " · " + esc(o.page) : ""}</option>`).join("");
      if ([...fSel.options].some((o) => o.value === last.f)) fSel.value = last.f;
      showNo();
    };
    if (byMod.has(last.m)) mSel.value = String(last.m);
    fillFR();
    mSel.onchange = fillFR;
    const close = () => { document.removeEventListener("keydown", key, true); ov.remove(); };
    const add = async () => {
      const [page, note] = fSel.value.split("\n"), m = +mSel.value;
      const fr = byMod.get(m).find((o) => o.v === fSel.value)?.fr || "";
      try { localStorage.setItem("annotator-shotto", JSON.stringify({ m, f: fSel.value })); } catch {}
      const no = xNo(fr, (await extraAll()).filter((x) => x.page === page && x.note === note).length);
      await extraPut({ id: "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), page, note, src: shot.src, w: shot.w, h: shot.h, caption: cap.value.replace(/\s+$/, "").replace(/^\s*\n/, ""), at: new Date().toISOString() });
      close(); autoUpdateSoon();
      toast("✓ Screenshot added as " + no + " (" + modName(m) + ") — shows in the report");
    };
    const key = (e) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === "Enter" && e.target.tagName !== "SELECT" && (e.target.tagName !== "TEXTAREA" || e.metaKey || e.ctrlKey)) { e.preventDefault(); e.stopPropagation(); add(); }
    };
    ov.addEventListener("pointerdown", (e) => e.stopPropagation());
    ov.addEventListener("click", (e) => { e.stopPropagation(); const a = e.target.closest("[data-a]")?.dataset.a; if (a === "yes") add(); else if (a === "no" || e.target === ov) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(ov);
    ov.querySelector('[data-a="yes"]').focus();
  }
  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // ---------- "All notes" panel: every note on this page, with status + go to / edit / hide / re-attach / delete ----------
  const list = document.createElement("div");
  list.className = "ann-list"; list.setAttribute("data-annotator-ui", "");
  const picked = new Set();
  let editingId = null, reattach = null, listTimer = null;

  function noteStatus(n) {
    if (n.manual) return ["man", "Added manually · report only"];
    const el = resolve(n);
    if (!el) return ["miss", "Not found on this screen"];
    if (n.hidden) return ["hid", "Hidden (pin)"];
    const r = el.getBoundingClientRect();
    if (!(r.width || r.height)) return ["miss", "Element not shown"];
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return ["off", "Off screen — scroll to it"];
    if (coveredAt(el, r)) return ["cov", "Behind something (e.g. a modal)"];
    return ["ok", "Visible"];
  }
  function toggleList(force) {
    const open = force != null ? force : !list.classList.contains("open");
    list.classList.toggle("open", open);
    clearInterval(listTimer);
    if (!open) activeId = null;
    if (!activeId) list.classList.remove("ann-left");
    if (open) { renderList(); listTimer = setInterval(() => { if (!editingId && !list.contains(document.activeElement)) renderList(); }, 800); }
  }
  // Move notes to another page: they leave this page and appear on that one, with their screenshots and ⌘⇧ extras.
  // Used when notes were saved on the wrong page (e.g. Workspace notes that ended up on Landing).
  function knownPages() {
    let pv = []; try { pv = JSON.parse(localStorage.getItem("annotator-pages") || "[]"); } catch {}
    const names = new Set(pv.concat(annotatedPages().map((p) => p.page)));
    document.querySelectorAll('a[href*=".html"]').forEach((a) => { try { names.add(decodeURIComponent(new URL(a.href).pathname.split("/").pop()).replace(/\.dc\.html$|\.html?$/, "")); } catch {} });
    names.delete(PAGE); names.delete("");
    return [...names];
  }
  function pickPage(ids) {
    const pages = knownPages();
    const ov = document.createElement("div");
    ov.className = "ann-confirm"; ov.setAttribute("data-annotator-ui", "");
    ov.innerHTML = `<div class="cb" role="dialog" aria-modal="true"><h4>Move ${ids.length} note${ids.length === 1 ? "" : "s"} to another page</h4>
      <p>They leave <b>${esc(PAGE)}</b> and show on the page you pick, with their screenshots. Open that page afterwards to see them.</p>
      <label style="display:flex;gap:8px;align-items:center"><span style="font-weight:600;font-size:12.5px">Page</span>
      <input list="ann-pages" style="flex:1;font:inherit;border:1px solid #d8d8de;border-radius:6px;padding:6px 8px" value="${esc(pages[0] || "")}" placeholder="Page file name without .dc.html"></label>
      <datalist id="ann-pages">${pages.map((p) => `<option value="${esc(p)}">`).join("")}</datalist>
      <div class="ca"><button data-c="no">Cancel</button><button data-c="yes" class="pr">Move</button></div></div>`;
    const inp = ov.querySelector("input");
    const close = () => { document.removeEventListener("keydown", key, true); ov.remove(); };
    const go = () => {
      const to = inp.value.trim().replace(/\.dc\.html$|\.html?$/, "");
      if (!to || to === PAGE) { inp.focus(); return; }
      close(); moveNotes(ids, to);
    };
    const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); go(); } };
    ov.addEventListener("pointerdown", (e) => e.stopPropagation());
    ov.addEventListener("click", (e) => { e.stopPropagation(); const c = e.target.closest("[data-c]")?.dataset.c; if (c === "yes") go(); else if (c === "no" || e.target === ov) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(ov); inp.focus(); inp.select();
  }
  // Notes can come from any page (this one or others); a note on several pages ends up only on `to`.
  async function moveNotes(ids, to) {
    const set = new Set(ids), srcs = [{ page: PAGE, key: KEY, notes }].concat(otherPages());
    const moving = new Map(); // this page's version first
    for (const pg of srcs) if (pg.page !== to) for (const n of pg.notes) if (n && set.has(n.id) && !moving.has(n.id)) moving.set(n.id, n);
    if (!moving.size) return 0;
    let dest = [];
    if (to === PAGE) dest = notes; else try { dest = JSON.parse(localStorage.getItem("annotator:" + to) || "[]"); } catch {}
    if (!Array.isArray(dest)) dest = [];
    // A copy already on that page is replaced by the moved (newer) version.
    dest = dest.filter((n) => !(n && moving.has(n.id))).concat([...moving.values()].map((n) => Object.assign({}, n, { hidden: false })));
    try { localStorage.setItem("annotator:" + to, JSON.stringify(dest)); } catch { alert("Couldn't move the notes (browser storage is full)."); return 0; }
    if (to === PAGE) notes = dest;
    for (const pg of srcs) {
      if (pg.page === to || !pg.notes.some((n) => n && moving.has(n.id))) continue;
      for (const id of moving.keys()) {
        if (!pg.notes.some((n) => n && n.id === id)) continue;
        const shot = await shotGet(pg.page, id);
        if (shot && !(await shotGet(to, id))) await shotPutTo(to, id, shot);
        await idb("readwrite", (st) => st.delete(pg.page + ":" + id)).catch(() => {});
      }
      const keep = pg.notes.filter((n) => !(n && moving.has(n.id)));
      if (pg.page === PAGE) { notes = keep; moving.forEach((n, id) => cache.delete(id)); }
      try { keep.length ? localStorage.setItem(pg.key, JSON.stringify(keep)) : localStorage.removeItem(pg.key); } catch {}
    }
    for (const x of await extraAll()) if (moving.has(x.note) && x.page !== to) await extraPut(Object.assign({}, x, { page: to }));
    // not save(): that would re-sync the copies just moved
    picked.clear(); updateToolbar(); autoUpdateSoon();
    if (list.classList.contains("open")) { list._html = ""; renderList(); }
    toast("✓ Moved " + moving.size + " note" + (moving.size === 1 ? "" : "s") + " to " + to);
    return moving.size;
  }
  // Move whole modules (e.g. M-2.0 … M-7.0) to a page in one go, wherever their notes are saved now.
  function pickModules() {
    const pages = uniquePages(annotatedPages()), mods = new Map();
    pages.forEach((pg) => frItems(pg).forEach((x) => { const m = modOf(x.fr); if (m == null) return;
      if (!mods.has(m)) mods.set(m, { ids: [], on: new Set() }); mods.get(m).ids.push(x.n.id); mods.get(m).on.add(pg.page); }));
    if (!mods.size) { alert("There are no numbered modules yet."); return; }
    const targets = [...new Set([...knownPages(), PAGE])];
    const ov = document.createElement("div");
    ov.className = "ann-confirm"; ov.setAttribute("data-annotator-ui", "");
    ov.innerHTML = `<div class="cb" role="dialog" aria-modal="true"><h4>Move modules to a page</h4>
      <p>Every note of the ticked modules (with screenshots) moves to the page you pick, from whatever page it's on now.</p>
      <div class="ann-mods">${[...mods].sort((a, b) => a[0] - b[0]).map(([m, v]) => `<label><input type="checkbox" value="${m}"><b>${esc(modName(m))}</b> · ${v.ids.length} note${v.ids.length === 1 ? "" : "s"} <small>on ${esc([...v.on].join(", "))}</small></label>`).join("")}</div>
      <label style="display:flex;gap:8px;align-items:center;margin-top:10px"><span style="font-weight:600;font-size:12.5px">To page</span>
      <input list="ann-pages2" style="flex:1;font:inherit;border:1px solid #d8d8de;border-radius:6px;padding:6px 8px" value="${esc(targets.find((t) => t !== PAGE) || "")}" placeholder="Page file name without .dc.html"></label>
      <datalist id="ann-pages2">${targets.map((p) => `<option value="${esc(p)}">`).join("")}</datalist>
      <div class="ca"><button data-c="no">Cancel</button><button data-c="yes" class="pr">Move</button></div></div>`;
    const inp = ov.querySelector("input[list]");
    const close = () => { document.removeEventListener("keydown", key, true); ov.remove(); };
    const go = async () => {
      const to = inp.value.trim().replace(/\.dc\.html$|\.html?$/, ""), ms = [...ov.querySelectorAll(".ann-mods input:checked")].map((c) => +c.value);
      if (!ms.length || !to) return;
      close();
      const n = await moveNotes(ms.flatMap((m) => mods.get(m).ids), to);
      if (n) toast("✓ Moved " + ms.map(modName).join(", ") + " (" + n + " notes) to " + to);
      else toast("Those modules are already on " + to);
    };
    const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === "Enter" && e.target === inp) { e.preventDefault(); e.stopPropagation(); go(); } };
    ov.addEventListener("pointerdown", (e) => e.stopPropagation());
    ov.addEventListener("click", (e) => { e.stopPropagation(); const c = e.target.closest("[data-c]")?.dataset.c; if (c === "yes") go(); else if (c === "no" || e.target === ov) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(ov);
  }
  // ⌘⇧ extra screenshots shown in the panel under their FR (read from IndexedDB in the background; the panel
  // redraws when they change).
  let listExtras = [], listExAt = 0;
  function refreshListExtras() {
    listExAt = Date.now();
    extraAll().then((xs) => {
      const sig = (a) => a.map((x) => x.id + ":" + x.note + ":" + (x.caption || "")).join("|");
      if (sig(xs) !== sig(listExtras)) { listExtras = xs; list._html = ""; if (list.classList.contains("open")) renderList(); }
    });
  }
  function renderList() {
    if (Date.now() - listExAt > 1500) refreshListExtras();
    const items = ordered(notes);
    const exOf = (id) => listExtras.filter((x) => x.note === id).sort((a, b) => String(a.at).localeCompare(String(b.at)));
    const exCount = items.reduce((t, x) => t + exOf(x.n.id).length, 0);
    // Badges use the report's numbers so the panel and the report always match; when the report numbered a note on
    // (same No. as another note), the No. typed on it is shown next to it.
    const rn = frRenumber().map;
    const missing = items.filter((x) => noteStatus(x.n)[0] === "miss").length;
    for (const id of [...picked]) if (!notes.some((n) => n.id === id)) picked.delete(id);
    const mine = new Set(notes.map((n) => n.id));
    const copies = otherPages().map((pg) => ({ page: pg.page, n: pg.notes.filter((c) => c && mine.has(c.id)).length })).filter((c) => c.n);
    const html = `<div class="lh"><b>All notes on this page (${notes.length})${exCount ? ` · ${exCount} ⌘⇧ screenshot${exCount === 1 ? "" : "s"}` : ""}</b><button data-a="close" title="Close">✕</button></div>
      ${copies.map((c) => `<div class="lcp">⚠ ${c.n} of these notes are also saved on <b>${esc(c.page)}</b> (copies of the same notes). Deleting or editing one here also changes it there.</div>`).join("")}
      <div class="lf"><label><input type="checkbox" data-a="all" ${picked.size && picked.size === notes.length ? "checked" : ""}> Select all</label>
        ${missing ? `<button data-a="pickmiss" title="Select the notes whose element can't be found on this screen">Select not found (${missing})</button>` : ""}
        <button data-a="movemods" title="Move whole modules (e.g. M-2.0 – M-7.0) to another page in one go">Move modules…</button>
        <button data-a="movepicked" ${picked.size ? "" : "disabled"} title="Move the selected notes (and their screenshots) to another page, e.g. the page their element is on">Move to page… (${picked.size})</button>
        <button data-a="delpicked" class="del" ${picked.size ? "" : "disabled"}>Delete selected (${picked.size})</button></div>
      <div class="lb">${items.length ? items.map((x) => {
        const n = x.n, [cls, label] = noteStatus(n), title = plainText(splitBody(n.body).title) || "(no title)";
        const typed = x.label; x = Object.assign({}, x, { label: rn.get(n.id) || x.label });
        const renumbered = x.label !== typed ? `<span class="rn" title="Several notes have No. ${esc(typed)} — the report numbers this one ${esc(x.label)}. Report → Save numbers to notes makes the box match.">No. ${esc(typed)} → ${esc(x.label)} in report</span>` : "";
        const target = n.manual ? "No element — Re-attach to point it at one" : n.tag + (n.text ? " · “" + n.text.slice(0, 40) + "”" : n.hint ? " · " + n.hint : "");
        if (editingId === n.id) return `<div class="row" data-id="${n.id}"><div class="mn">
          <div class="tl"><span class="nb">${esc(x.label)}</span><span class="t">Edit note</span></div>
          <input class="ni" placeholder="No. (e.g. FR-1.1)" value="${esc(n.num || "")}"><input class="si" placeholder="Subtitle (optional)" value="${esc(n.sub || "")}"><textarea>${esc(n.body)}</textarea>
          <div class="ac"><button data-a="save" class="pr">Save</button><button data-a="cancel">Cancel</button></div></div></div>`;
        return `<div class="row${n.id === activeId ? " active" : ""}" data-id="${n.id}" title="Click to highlight it on the page"><input type="checkbox" data-a="pick" ${picked.has(n.id) ? "checked" : ""}>
          <div class="mn"><div class="tl"><span class="nb">${esc(x.label)}</span><span class="t" title="${esc(n.body)}">${esc(title)}</span></div>${renumbered}${n.sub ? `<div class="sb">${esc(plainText(n.sub))}</div>` : ""}
          <div class="el" title="${esc(target)}">${esc(target)}</div>
          <span class="st ${cls}">${esc(label)}</span>
          <div class="ac"><button data-a="go" ${cls === "man" ? "disabled title='Added manually — not attached to an element'" : cls === "miss" ? "disabled title='Its element is not on this screen — open the screen/modal it belongs to, or re-attach it'" : ""}>Go to</button>
            <button data-a="edit">Edit</button>
            <button data-a="vis">${n.hidden ? "Show" : "Hide"}</button>
            <button data-a="reattach" title="Then ⌘/Ctrl-click the element this note should point at">Re-attach</button>
            <button data-a="del" class="del">Delete</button></div></div></div>` +
          exOf(n.id).map((e, xi) => { const c = capParts(e.caption);
            return `<div class="row xrow" data-x="${esc(e.id)}" data-note="${n.id}" title="⌘⇧ screenshot of ${esc(x.label)} — shown in the report under that FR"><img data-xsrc="${esc(e.id)}" alt="">
            <div class="mn"><div class="tl"><span class="nb">${esc(xNo(x.label, xi))}</span><span class="t">${esc(plainText(c.head.replace(/^[-•*]\s+/, "")) || "Screenshot")}</span></div>
            ${c.lines.length ? `<div class="xc">${esc(c.lines.map((l) => plainText(l.text)).join(" · "))}</div>` : ""}
            <div class="ac"><button data-a="xgo" ${cls === "man" || cls === "miss" ? "disabled" : ""} title="Go to ${esc(x.label)} on the page">Go to ${esc(x.label)}</button><button data-a="xedit" title="Edit the caption, or move it under another FR">Edit / Move</button><button data-a="xdel" class="del">Remove</button></div></div></div>`; }).join("");
      }).join("") : '<div class="empty">No notes on this page yet.</div>'}</div>`;
    // The panel refreshes itself every 800ms (statuses change as you scroll / open modals): only redraw when
    // something changed, and keep the list's scroll position so scrolling down it doesn't jump back to the top.
    if (html === list._html) return;
    const lb = list.querySelector(".lb"), top = lb ? lb.scrollTop : 0;
    list.innerHTML = html; list._html = html;
    list.querySelectorAll("img[data-xsrc]").forEach((im) => { const e = listExtras.find((x) => x.id === im.dataset.xsrc); if (e) im.src = e.src; });
    const nb = list.querySelector(".lb"); if (nb) nb.scrollTop = top;
  }
  // Make a note the active one: scroll its element into view, outline it with a pulsing ring and bring its box to
  // the front (showing it while active, even if hidden). With scroll=false (box clicked on the page) only the panel row is highlighted.
  function setActive(id, scroll = true) {
    activeId = id;
    if (!id) list.classList.remove("ann-left");
    const n = notes.find((x) => x.id === id);
    if (n && scroll) {
      const el = resolve(n);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        setTimeout(() => { const v = cards.get(n.id); if (v) { v.card.classList.remove("ann-flash"); void v.card.offsetWidth; v.card.classList.add("ann-flash"); } }, 450);
      }
    }
    if (list.classList.contains("open")) {
      renderList();
      if (!scroll) list.querySelector('.row[data-id="' + id + '"]')?.scrollIntoView({ block: "nearest" });
    }
  }
  list.addEventListener("click", (e) => {
    const xr = e.target.closest(".xrow");
    if (xr) {
      const xa = e.target.closest("[data-a]")?.dataset.a, ex = listExtras.find((x) => x.id === xr.dataset.x);
      if (!ex) return;
      if (xa === "xgo") return setActive(xr.dataset.note);
      if (xa === "xedit") return editExtraCaption(ex, xr.querySelector(".nb").textContent);
      if (xa === "xdel") return confirmRemoveExtra(ex, xr.querySelector(".nb").textContent);
      return;
    }
    const row = e.target.closest(".row"), n = row && notes.find((x) => x.id === row.dataset.id);
    // A click on the row itself (not a button, checkbox or edit field) picks that note; clicking it again deselects it.
    if (n && editingId !== n.id && !e.target.closest("button, input, textarea, label, a")) return activeId === n.id ? setActive(null, false) : setActive(n.id);
    const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
    if (a === "close") return toggleList(false);
    if (a === "all") { if (e.target.checked) notes.forEach((x) => picked.add(x.id)); else picked.clear(); }
    if (a === "pickmiss") notes.forEach((x) => { if (noteStatus(x)[0] === "miss") picked.add(x.id); });
    if (a === "pick" && n) { if (e.target.checked) picked.add(n.id); else picked.delete(n.id); }
    if (a === "movemods") { pickModules(); return; }
    if (a === "movepicked" && picked.size) { pickPage([...picked]); return; }
    if (a === "delpicked" && picked.size) { confirmDelete([...picked]).then((ok) => { if (ok) { [...picked].forEach(remove); picked.clear(); renderList(); } }); return; }
    if (a === "del" && n) { confirmDelete([n.id]).then((ok) => { if (ok) { remove(n.id); renderList(); } }); return; }
    if (a === "vis" && n) { n.hidden = !n.hidden; visible = true; if (n.hidden && activeId === n.id) activeId = null; save(); }
    // Edit opens the full editor (Full screen, formatting, subtitle) — next to the element when it's on screen,
    // centred for manual notes or when the element isn't found.
    if (a === "edit" && n) { const el = n.manual ? null : resolve(n); openEditor(el && noteStatus(n)[0] !== "miss" ? el : null, n); return; }
    if (a === "cancel") editingId = null;
    if (a === "save" && n) {
      const body = row.querySelector("textarea").value.trim();
      if (body) { n.body = body; n.num = row.querySelector(".ni").value.trim() || null; n.sub = row.querySelector(".si").value.trim() || undefined; save(); snapSoon(n); }
      editingId = null;
    }
    if (a === "go" && n) return setActive(n.id);
    if (a === "reattach" && n) { setReattach(n.id); return; }
    renderList();
  });

  // A ⌘⇧ screenshot, edited from All notes: its caption (same keys as in the report — bullets, Tab / Shift+Tab,
  // ⌘/Ctrl+Enter saves) and the FR it sits under. Moving it (e.g. FR-3.1.2.13 → FR-3.1.3) adds it as the last
  // screenshot of the new FR; the old FR's screenshots after it are renumbered.
  async function editExtraCaption(ex, no) {
    const { pages, mods, byMod } = frChoices(), cur = ex.page + "\n" + ex.note;
    const curMod = mods.find(({ m }) => byMod.get(m).some((o) => o.v === cur))?.m;
    const xCount = new Map(); (await extraAll()).forEach((x) => { if (x.id === ex.id) return; const v = x.page + "\n" + x.note; xCount.set(v, (xCount.get(v) || 0) + 1); });
    const ov = document.createElement("div");
    ov.className = "ann-confirm ann-shotpick"; ov.setAttribute("data-annotator-ui", "");
    ov.innerHTML = `<div class="cb" role="dialog" aria-modal="true"><h4>Edit screenshot · ${esc(no)}</h4>
      <p>Pick another Module / FR to move it there. First line of the caption goes next to the No.; next lines are the description. “- ” starts a bullet · Tab / Shift+Tab = sub-bullet / back · ${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+Enter saves.</p>
      <img src="${ex.src}" alt="" style="display:block;max-width:100%;max-height:160px;object-fit:contain;border:1px solid #e3e3e8;border-radius:6px;margin:0 0 8px">
      ${mods.length ? `<label class="fl"><span>Module</span><select data-m>${mods.map(({ m, frs }) => `<option value="${m}">${esc(modName(m))} (${frs.length} FR${frs.length === 1 ? "" : "s"})</option>`).join("")}</select></label>
      <label class="fl"><span>FR</span><select data-f></select></label>
      <label class="fl"><span>No.</span><b data-no></b></label>` : ""}
      <textarea style="width:100%;min-height:130px;font:13px/1.45 Inter,system-ui,sans-serif;border:1px solid #d8d8de;border-radius:6px;padding:8px;resize:vertical;box-sizing:border-box"></textarea>
      <div class="ca"><button data-c="no">Cancel</button><button data-c="yes" class="pr">Save</button></div></div>`;
    const ta = ov.querySelector("textarea"); ta.value = ex.caption || ""; bulletKeys(ta);
    const mSel = ov.querySelector("[data-m]"), fSel = ov.querySelector("[data-f]");
    const pickedFR = () => mSel && byMod.get(+mSel.value).find((o) => o.v === fSel.value);
    const showNo = () => { const o = pickedFR(); ov.querySelector("[data-no]").textContent = !o ? "" : o.v === cur ? no : xNo(o.fr, xCount.get(o.v) || 0); };
    const fillFR = (keep) => {
      fSel.innerHTML = byMod.get(+mSel.value).map((o) => `<option value="${esc(o.v)}">${esc(o.fr)} — ${esc(o.title || "(no title)")}${pages.length > 1 ? " · " + esc(o.page) : ""}</option>`).join("");
      if (keep && [...fSel.options].some((o) => o.value === cur)) fSel.value = cur;
      showNo();
    };
    if (mSel) {
      if (curMod != null) mSel.value = String(curMod);
      fillFR(true);
      mSel.onchange = () => fillFR(true); fSel.onchange = showNo;
    }
    const close = () => { document.removeEventListener("keydown", key, true); ov.remove(); };
    const go = async () => {
      const caption = ta.value.replace(/\s+$/, "").replace(/^\s*\n/, ""), o = pickedFR();
      if (o && o.v !== cur) {
        const [page, note] = o.v.split("\n"), to = xNo(o.fr, xCount.get(o.v) || 0);
        await extraPut(Object.assign({}, ex, { page, note, caption, at: new Date().toISOString() }));
        close(); autoUpdateSoon(); refreshListExtras(); toast("✓ Moved " + no + " → " + to);
        return;
      }
      await extraPut(Object.assign({}, ex, { caption }));
      close(); autoUpdateSoon(); refreshListExtras(); toast("✓ Caption saved · " + no);
    };
    const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); e.stopPropagation(); go(); } };
    ov.addEventListener("pointerdown", (e) => e.stopPropagation());
    ov.addEventListener("click", (e) => { e.stopPropagation(); const c = e.target.closest("[data-c]")?.dataset.c; if (c === "yes") go(); else if (c === "no" || e.target === ov) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(ov); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
  }
  function confirmRemoveExtra(ex, no) {
    const ov = document.createElement("div");
    ov.className = "ann-confirm"; ov.setAttribute("data-annotator-ui", "");
    ov.innerHTML = `<div class="cb" role="dialog" aria-modal="true"><h4>Remove screenshot ${esc(no)}?</h4>
      <p>It's removed from the report, PDF and Word. The page and its notes are not changed; the next screenshots of this FR are renumbered.</p>
      <img src="${ex.src}" alt="" style="display:block;max-width:100%;max-height:160px;object-fit:contain;border:1px solid #e3e3e8;border-radius:6px">
      <div class="ca"><button data-c="no">Cancel</button><button data-c="yes" class="dz">Remove</button></div></div>`;
    const close = () => { document.removeEventListener("keydown", key, true); ov.remove(); };
    const go = async () => { close(); await extraDel(ex.id); autoUpdateSoon(); refreshListExtras(); toast("Removed screenshot " + no); };
    const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } };
    ov.addEventListener("pointerdown", (e) => e.stopPropagation());
    ov.addEventListener("click", (e) => { e.stopPropagation(); const c = e.target.closest("[data-c]")?.dataset.c; if (c === "yes") go(); else if (c === "no" || e.target === ov) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(ov); ov.querySelector('[data-c="no"]').focus();
  }
  function setReattach(id) {
    reattach = id;
    banner.style.display = id ? "block" : "none";
    if (id) banner.textContent = "Re-attach note " + numOf(notes.find((n) => n.id === id), notes.findIndex((n) => n.id === id)) + ": " + (/Mac/.test(navigator.platform) ? "⌘" : "Ctrl") + "-click the element it should point at · Esc to cancel";
    else banner.textContent = "Click another note to connect it · click the same pair again to disconnect · Esc to cancel";
  }
  function attachTo(id, el) {
    const n = notes.find((x) => x.id === id); setReattach(null);
    if (!n) return;
    Object.assign(n, { manual: undefined, selector: selectorFor(el), tag: el.tagName.toLowerCase(), text: textOf(el), hint: hintOf(el), dx: null, dy: null, hidden: false });
    cache.set(n.id, el); lastScan.delete(n.id);
    visible = true; save(); snapSoon(n, 300);
    if (list.classList.contains("open")) renderList();
  }

  // ---------- report (PDF via print / Word .docx) ----------
  function annotatedPages() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("annotator:") !== 0) continue;
      const page = k.slice(10);
      let list = page === PAGE ? notes : null;
      if (!list) try { list = JSON.parse(localStorage.getItem(k) || "[]"); } catch { list = []; }
      if (Array.isArray(list) && list.length) out.push({ page, notes: list });
    }
    if (!out.some((p) => p.page === PAGE) && notes.length) out.push({ page: PAGE, notes });
    // First page = the one annotated first.
    const first = (p) => Math.min(...p.notes.map((n) => Date.parse(n.created) || Infinity));
    return out.sort((a, b) => first(a) - first(b));
  }

  // Every note of a page with its FR label as the report numbers it: custom numbers (e.g. "FR-1.1") as-is,
  // auto-numbered notes FR-<section>.<n> (in the order they were added, skipping numbers custom FRs already use).
  // Labels are given first and then sorted, so the report always runs FR-1.9 → FR-1.10 → FR-1.11.
  // The section number is the page's place among ALL annotated pages (not just the ones in this report), and a
  // number counts as used if a custom FR on ANY page has it — so a blank note on page 2 never becomes a second FR-2.1.
  const frItems = (pg) => {
    const pages = annotatedPages(), sec = Math.max(0, pages.findIndex((p) => p.page === pg.page)) + 1;
    const has = (n) => n.num != null && String(n.num).trim() !== "", used = new Set();
    pages.concat(pages.some((p) => p.page === pg.page) ? [] : [pg]).forEach((p) => p.notes.forEach((n) => { const m = has(n) && String(n.num).match(/^\D*(\d+)\.(\d+)/); if (m && +m[1] === sec) used.add(+m[2]); }));
    let k = 0;
    return pg.notes.map((n, i) => {
      let fr = has(n) ? String(n.num).trim() : "";
      if (!fr) { do k++; while (used.has(k)); fr = "FR-" + sec + "." + k; }
      return { n, i, label: fr, fr, k: numKey(fr) };
    }).sort((a, b) => numCmp(a.k, b.k) || a.i - b.i);
  };
  // ⌘⇧ extra screenshots of an FR are numbered on from it in order: FR-1.7 → FR-1.7.1, FR-1.7.2 … (renumbered when one is removed).
  const xNo = (fr, xi) => fr + "." + (xi + 1);
  // Module = the FR's first number: FR-1.1 … FR-1.6 belong to M-1.0. null when the label has no digits.
  const modOf = (fr) => { const m = String(fr).match(/\d+/); return m ? +m[0] : null; };
  const modName = (m) => "M-" + m + ".0";
  // Next free numbers for "+ Add": the module after the highest one, and the FR after the highest in a module
  // (FR-7.3 → FR-7.4; sub-FRs like FR-7.3.1 count as 7.3), over every annotated page.
  function nextNums() {
    const labels = []; annotatedPages().forEach((pg, gi) => frItems(pg, gi).forEach((x) => labels.push(String(x.fr))));
    const mods = [...new Set(labels.map(modOf).filter((m) => m != null))].sort((a, b) => a - b);
    return { mods, nextMod: (mods.length ? mods[mods.length - 1] : 0) + 1,
      nextFR: (m) => { let k = 0; labels.forEach((l) => { const mm = l.match(/^\D*(\d+)\.(\d+)/); if (mm && +mm[1] === m && !/^\s*M/i.test(l)) k = Math.max(k, +mm[2]); }); return "FR-" + m + "." + (k + 1); } };
  }
  // The same note saved on two pages (e.g. notes imported into two copies of a mockup) is listed once, on the
  // first page — otherwise the report repeats its FR number, row and screenshot.
  function uniquePages(pages) {
    const seen = new Set();
    return pages.map((pg) => Object.assign({}, pg, { notes: pg.notes.filter((n) => n && n.id && !seen.has(n.id) && seen.add(n.id)) }));
  }
  // Report numbers without duplicates: FRs in number order (ties: the note added first keeps the number); a number
  // already given to an earlier sibling is bumped to the next free one, and the ones after shift along —
  // FR-5.3, FR-5.3, FR-5.4 → FR-5.3, FR-5.4, FR-5.5. Sub-FRs follow their parent (FR-3.9.1 → FR-3.10.1 when FR-3.9
  // became FR-3.10). Module labels (M-1.0) and labels without "FR-n.n" are left as typed.
  // Returns { map: note id → report label, changed: [{ id, from, to }] } over every annotated page.
  function frRenumber() {
    const items = [];
    uniquePages(annotatedPages()).forEach((pg) => frItems(pg).forEach((x) => items.push(x)));
    items.sort((a, b) => numCmp(a.k, b.k) || (Date.parse(a.n.created) || 0) - (Date.parse(b.n.created) || 0));
    const map = new Map(), moved = new Map(), last = new Map(), changed = [];
    for (const x of items) {
      const m = String(x.fr).match(/^(\s*FR[-\s]?)(\d+(?:\.\d+)+)\s*$/i);
      if (!m) { map.set(x.n.id, x.fr); continue; }
      const path = m[2].split(".").map(Number), oldPar = path.slice(0, -1).join(".");
      const par = moved.has(oldPar) ? moved.get(oldPar) : oldPar;
      const k = last.has(par) ? Math.max(path[path.length - 1], last.get(par) + 1) : path[path.length - 1];
      last.set(par, k);
      const now = par + "." + k;
      if (!moved.has(path.join("."))) moved.set(path.join("."), now);
      const fr = m[1].trim() + now;
      map.set(x.n.id, fr);
      if (fr !== String(x.fr).trim()) changed.push({ id: x.n.id, from: x.fr, to: fr });
    }
    return { map, changed };
  }
  // "Save numbers to notes": write the report's renumbered FRs into the notes' No. on every page they're saved on.
  function applyNums(changed) {
    const to = new Map(changed.map((c) => [c.id, c.to]));
    annotatedPages().forEach((pg) => {
      if (pg.page === PAGE) return;
      let hit = false; pg.notes.forEach((n) => { if (n && to.has(n.id)) { n.num = to.get(n.id); hit = true; } });
      if (hit) try { localStorage.setItem("annotator:" + pg.page, JSON.stringify(pg.notes)); } catch {}
    });
    notes.forEach((n) => { if (to.has(n.id)) n.num = to.get(n.id); });
    save(); autoUpdateSoon();
  }
  function modulesIn(pages) {
    pages = uniquePages(pages);
    const mods = new Map();
    pages.forEach((pg, gi) => frItems(pg, gi).forEach((x) => {
      const m = modOf(x.fr); if (m == null) return;
      if (!mods.has(m)) mods.set(m, []);
      mods.get(m).push(x.fr);
    }));
    return [...mods.entries()].sort((a, b) => a[0] - b[0]).map(([m, frs]) => ({ m, frs }));
  }

  // Delete a whole module (e.g. M-2.0 and FR-2.1 … FR-2.9) from EVERY annotated page, with its screenshots.
  async function deleteModule(m) {
    const hits = [];
    annotatedPages().forEach((pg) => frItems(pg).forEach((x) => { if (modOf(x.fr) === m) hits.push({ id: x.n.id, fr: x.fr, page: pg.page, title: plainText(splitBody(x.n.body).title) }); }));
    const ids = [...new Set(hits.map((h) => h.id))];
    if (!ids.length) return false;
    const pages = [...new Set(hits.map((h) => h.page))];
    const lines = [...new Map(hits.map((h) => [h.id, h])).values()].slice(0, 15).map((h) => "  " + h.fr + "  " + (h.title || "")).join("\n");
    if (!confirm("Delete " + modName(m) + " — " + ids.length + " note" + (ids.length === 1 ? "" : "s") + " on " + pages.join(", ") + "?\n\n" + lines + (ids.length > 15 ? "\n  …" : "") + "\n\nTheir screenshots are removed too. This can't be undone — use Export first if you may need them.")) return false;
    ids.filter((id) => notes.some((n) => n.id === id)).forEach(remove); // this page (also removes copies elsewhere)
    dropCopies(ids); // notes saved only on other pages
    (await extraAll()).filter((x) => ids.includes(x.note)).forEach((x) => extraDel(x.id));
    updateToolbar(); autoUpdateSoon();
    if (list.classList.contains("open")) { list._html = ""; renderList(); }
    toast("✓ Deleted " + modName(m) + " (" + ids.length + " note" + (ids.length === 1 ? "" : "s") + ")");
    return true;
  }
  function showReportMenu() {
    if (pop.style.display === "block") { pop.style.display = "none"; return; }
    const pages = annotatedPages();
    const total = pages.reduce((t, p) => t + p.notes.length, 0);
    if (!total) { alert("There are no notes yet. " + (/Mac/.test(navigator.platform) ? "⌘" : "Ctrl") + "+click an element to add one."); return; }
    const scoped = () => (pages.length < 2 || pop.querySelector('input[value="all"]').checked ? pages : pages.filter((p) => p.page === PAGE));
    if (pages.length < 2 && modulesIn(pages).length < 2) { openReport(pages); return; }
    pop.innerHTML = `<h4>Generate report</h4>
      ${pages.length < 2 ? "" : `<label><input type="radio" name="ann-scope" value="page" checked><span>This page<small>${notes.length} note${notes.length === 1 ? "" : "s"} on ${esc(PAGE)}</small></span></label>
      <label><input type="radio" name="ann-scope" value="all"><span>All annotated pages<small>${total} notes on ${pages.length} pages, first page to last</small></span></label>`}
      <div class="ann-mod"><span>Module</span><select data-mod></select><button data-act="delmod" class="ann-delmod" title="Delete every note of this module, on every page">🗑 Delete module</button></div>
      <div class="ann-row"><button data-act="close">Cancel</button><button class="ann-primary" data-act="go">Open report</button></div>`;
    // Module list follows the chosen scope: "All modules" or one module, e.g. "M-1.0 · FR-1.1 – FR-1.6 (6)".
    const fillMods = () => {
      const sel = pop.querySelector("[data-mod]"), was = sel.value;
      const n = uniquePages(scoped()).reduce((t, p) => t + p.notes.length, 0);
      sel.innerHTML = `<option value="">All modules (${n})</option>` + modulesIn(scoped()).map(({ m, frs }) =>
        `<option value="${m}">${esc(modName(m))} · ${esc(frs[0])}${frs.length > 1 ? " – " + esc(frs[frs.length - 1]) : ""} (${frs.length})</option>`).join("");
      if ([...sel.options].some((o) => o.value === was)) sel.value = was;
      pop.querySelector("[data-act=delmod]").disabled = sel.value === "";
    };
    fillMods();
    pop.style.display = "block";
    pop.onchange = (e) => { if (e.target.name === "ann-scope" || e.target.matches("[data-mod]")) fillMods(); };
    pop.onclick = (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (act === "close") pop.style.display = "none";
      if (act === "delmod") deleteModule(+pop.querySelector("[data-mod]").value).then((done) => { if (done) { pop.style.display = "none"; } });
      if (act === "go") {
        const v = pop.querySelector("[data-mod]").value;
        pop.style.display = "none";
        openReport(scoped(), v === "" ? null : +v);
      }
    };
  }

  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---------- links → chips (like smart chips in Google Docs) ----------
  // A pasted URL becomes a chip with an icon and a readable title; "[My title](https://…)" sets the title yourself.
  const LINK_RE = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"']+)/g;
  const KINDS = {
    pdf: ["PDF", "#e1251b"], figma: ["F", "#a259ff"], confluence: ["C", "#1868db"], jira: ["J", "#2684ff"], monday: ["M", "#ff3d57"],
    gdoc: ["G", "#1a73e8"], video: ["▶", "#111111"], file: ["DOC", "#2b579a"], link: ["↗", "#6b6b72"],
  };
  function linkInfo(url, label) {
    let u; try { u = new URL(url); } catch { return { url, title: label || url, kind: "link" }; }
    const host = u.hostname.replace(/^www\./, "");
    let path = u.pathname; try { path = decodeURIComponent(path); } catch {}
    const file = path.split("/").filter(Boolean).pop() || "";
    let kind = "link", title = "", m;
    if (/\.pdf$/i.test(path)) { kind = "pdf"; title = file; }
    else if (/figma\.com$/.test(host)) { kind = "figma"; m = path.match(/\/(?:file|design|proto|board)\/[^/]+\/([^/]+)/); title = m ? m[1].replace(/-/g, " ") : "Figma design"; }
    else if (/atlassian\.net$/.test(host) && /\/wiki\//.test(path)) { kind = "confluence"; m = path.match(/\/pages\/\d+\/([^/]+)/); title = m ? m[1].replace(/\+/g, " ") : "Confluence page"; }
    else if (/atlassian\.net$|jira/.test(host)) { kind = "jira"; m = (path + u.search).match(/[A-Z][A-Z0-9]+-\d+/); title = m ? m[0] : "JIRA ticket"; }
    else if (/monday\.com$/.test(host)) { kind = "monday"; m = path.match(/\/pulses\/(\d+)/); title = m ? "Monday item " + m[1] : "Monday board"; }
    else if (host === "docs.google.com") { kind = "gdoc"; title = { document: "Google Doc", spreadsheets: "Google Sheet", presentation: "Google Slides" }[path.split("/")[1]] || "Google Drive file"; }
    else if (host === "drive.google.com") { kind = "gdoc"; title = "Google Drive file"; }
    else if (/\.(mp4|mov|webm)$/i.test(path)) { kind = "video"; title = file; }
    else if (/(^|\.)(loom\.com|youtube\.com|youtu\.be|vimeo\.com)$/.test(host)) { kind = "video"; title = "Video · " + host; }
    else if (/\.(docx?|xlsx?|pptx?|csv)$/i.test(path)) { kind = "file"; title = file; }
    else { title = host + (path.length > 1 ? path.replace(/\/$/, "") : ""); if (title.length > 60) title = host + " › " + file; }
    return { url, title: label || title || url, kind };
  }
  // Splits text into plain strings and link objects.
  function linkParts(text) {
    const out = [], s = String(text == null ? "" : text);
    let last = 0, m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(s))) {
      let url = m[2] || m[3], end = m.index + m[0].length;
      if (m[3]) {
        const hlEnd = url.indexOf("=="); if (hlEnd > 8) { end -= url.length - hlEnd; url = url.slice(0, hlEnd); }
        const trail = url.match(/[.,;:!?)\]]+$/); if (trail) { url = url.slice(0, -trail[0].length); end -= trail[0].length; }
      }
      if (m.index > last) out.push(s.slice(last, m.index));
      const label = m[1] ? m[1].trim() : "";
      out.push(Object.assign(linkInfo(url, label), { label, raw: s.slice(m.index, end), start: m.index, end }));
      last = end; LINK_RE.lastIndex = end;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }
  const chipHTML = (l, i) => { const [ic, c] = KINDS[l.kind] || KINDS.link; return `<a class="ann-chip" data-i="${i}" href="${esc(l.url)}" target="_blank" rel="noopener" title="${esc(l.url)}"><span class="ann-ic" style="background:${c}">${ic}</span>${esc(l.title)}</a>`; };
  // ---------- highlights: ==text== (yellow) or =={green}text== (like a highlighter pen; used to flag questions to check) ----------
  const HL_RE = /==(?:\{([a-z]+)\})?([^\n]+?)==/g; // [1] = color name (none = yellow), [2] = text
  // Colors: fill on screen/PDF, Word highlight name (yellow keeps a real Word highlight; others use shading).
  const HL_COLORS = { yellow: ["#fde047", "yellow"], green: ["#86efac"], blue: ["#93c5fd"], pink: ["#f9a8d4"], orange: ["#fdba74"], purple: ["#c4b5fd"] };
  const hlFill = (c) => (HL_COLORS[c] || HL_COLORS.yellow)[0];
  // Last color picked in the ▾ menu, remembered per browser.
  const hlColor = () => { try { const c = localStorage.getItem("annotator-hlcolor"); return HL_COLORS[c] ? c : "yellow"; } catch { return "yellow"; } };
  const setHlColor = (c) => { try { localStorage.setItem("annotator-hlcolor", c); } catch {} };
  // Bold: **text**.
  const BOLD_RE = /\*\*([^\n*]+?)\*\*/g;
  const boldHTML = (escaped) => escaped.replace(BOLD_RE, "<b>$1</b>");
  const hlOpen = (c) => "==" + (c && c !== "yellow" && HL_COLORS[c] ? "{" + c + "}" : "");
  function hlParts(text) {
    const out = [], s = String(text == null ? "" : text);
    let last = 0, m;
    HL_RE.lastIndex = 0;
    while ((m = HL_RE.exec(s))) {
      if (m.index > last) out.push({ text: s.slice(last, m.index), hl: false });
      out.push({ text: m[2], hl: true, color: HL_COLORS[m[1]] ? m[1] : "yellow" });
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push({ text: s.slice(last), hl: false });
    return out;
  }
  const hasHL = (text) => { HL_RE.lastIndex = 0; return HL_RE.test(String(text || "")); };
  // Text → HTML with yellow highlights and link chips (chip data-i counts links across the whole text).
  // ctr (optional) shares the chip counter across several calls, e.g. a note rendered line by line.
  const linkifyHTML = (text, ctr = { i: 0 }) => {
    return hlParts(text).map((seg) => {
      const inner = linkParts(seg.text).map((p) => (typeof p === "string" ? boldHTML(esc(p)) : chipHTML(p, ctr.i++))).join("");
      return seg.hl ? `<mark class="ann-mark"${seg.color !== "yellow" ? ` style="background:${hlFill(seg.color)}"` : ""}>${inner}</mark>` : inner;
    }).join("");
  };
  // ---------- bullets + sub-bullets: "- text", indented by 2 spaces (or a tab) per level ----------
  const BULLETS = ["•", "◦", "▪"];
  const LINE_RE = /^([ \t]*)(?:([-•]|\*(?!\*))\s*)?(.*)$/;
  function lineInfo(raw) {
    const m = String(raw).match(LINE_RE), w = m[1].replace(/\t/g, "  ").length;
    return { bullet: !!m[2], level: Math.min(m[2] ? 2 : 3, Math.floor(w / 2)), text: m[3].trim() };
  }
  // A note's text for its callout box: bullet lines get •/◦/▪ with a hanging indent, indented lines keep their depth.
  // Bullet typing for any textarea (⌘⇧ captions): Tab / Shift+Tab indent / outdent the current or selected lines,
  // Enter on a bullet starts the next bullet at the same depth, Enter on an empty bullet ends the list.
  function bulletKeys(ta) {
    ta.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
      if (e.key === "Tab") {
        e.preventDefault(); e.stopPropagation();
        const a = v.lastIndexOf("\n", s - 1) + 1, bEnd = v.indexOf("\n", Math.max(s, en - (en > s && v[en - 1] === "\n" ? 1 : 0)));
        const b = bEnd < 0 ? v.length : bEnd;
        let first = 0, total = 0;
        const out = v.slice(a, b).split("\n").map((l, i) => {
          if (!e.shiftKey) { if (i === 0) first = 2; total += 2; return "  " + l; }
          const cut = l.startsWith("\t") ? 1 : Math.min(2, l.length - l.trimStart().length);
          if (i === 0) first = -cut; total -= cut; return l.slice(cut);
        }).join("\n");
        ta.value = v.slice(0, a) + out + v.slice(b);
        ta.setSelectionRange(Math.max(a, s + first), Math.max(a, en + total));
      } else if (e.key === "Enter" && !e.shiftKey && s === en) {
        const a = v.lastIndexOf("\n", s - 1) + 1, m = v.slice(a, s).match(/^([ \t]*)([-•]|\*(?!\*))(\s+)(.*)$/);
        if (!m) return;
        e.preventDefault(); e.stopPropagation();
        if (!m[4].trim()) { ta.value = v.slice(0, a) + v.slice(s); ta.setSelectionRange(a, a); return; }
        const ins = "\n" + m[1] + m[2] + " ";
        ta.value = v.slice(0, s) + ins + v.slice(s); ta.setSelectionRange(s + ins.length, s + ins.length);
      }
    });
  }
  // A ⌘⇧ caption: first line goes next to the FR label, the following lines are a description (bullets like notes).
  const capParts = (caption) => { const ls = String(caption || "").split("\n").filter((l) => l.trim()); return { head: (ls[0] || "").trim(), lines: ls.slice(1).map(lineInfo) }; };

  // sub = the note's subtitle, shown right under its title (first line).
  const cardHTML = (body, sub) => {
    const ctr = { i: 0 }; let titled = !sub;
    return String(body || "").split("\n").map((raw) => {
      if (!raw.trim()) return '<div class="ann-ln">&nbsp;</div>';
      const L = lineInfo(raw), pad = L.level * 1.1 + (L.bullet ? 1.1 : 0);
      const after = titled ? "" : (titled = true, `<div class="ann-sub">${linkifyHTML(sub, ctr)}</div>`);
      return `<div class="ann-ln" style="padding-left:${pad}em${L.bullet ? ";text-indent:-1.1em" : ""}">${L.bullet ? `<span class="ann-bu">${BULLETS[L.level]}</span>` : ""}${linkifyHTML(L.text, ctr)}</div>` + after;
    }).join("");
  };
  const HL_CSS = `mark.ann-mark{background:#fde047;color:inherit;padding:0 2px;border-radius:2px;-webkit-print-color-adjust:exact;print-color-adjust:exact}`;

  // ---------- "Insert link" dialog: Title + URL (like Google Docs) ----------
  // Links are stored in the text as [Title](https://…), or just the URL when no title is given.
  const fmtLink = (title, url) => { const tt = String(title || "").replace(/[\[\]\n]/g, " ").trim(); return tt ? "[" + tt + "](" + url + ")" : url; };
  const linkList = (text) => linkParts(text).filter((p) => typeof p !== "string");
  // Replaces the link under the selection (or the selected text) with a new link; returns the new text.
  function applyLink(text, s, e, hit, title, url) {
    const [a, b] = hit ? [hit.start, hit.end] : [s, e];
    return text.slice(0, a) + fmtLink(title, url) + text.slice(b);
  }
  const linkAt = (text, s, e) => linkList(text).find((p) => p.start <= s && e <= p.end) || null;

  const LINKFORM_CSS = `.ann-linkform,.ann-chippop{position:fixed;z-index:2147483646;background:#fff;border:1px solid #dadce0;border-radius:10px;box-shadow:0 8px 28px rgba(20,20,40,.22);font:13px/1.4 Inter,system-ui,-apple-system,sans-serif;color:#0e0e10}
  .ann-linkform{width:340px;padding:12px}
  .ann-linkform h5{margin:0 0 8px;font-size:13px}
  .ann-linkform label{display:block;font-size:11px;font-weight:600;color:#6b6b72;margin-bottom:8px}
  .ann-linkform input{display:block;width:100%;box-sizing:border-box;margin-top:3px;border:1px solid #d8d8de;border-radius:6px;padding:6px 8px;font:inherit;font-size:13px;color:#0e0e10;outline:none}
  .ann-linkform input:focus{border-color:${ACCENT};box-shadow:0 0 0 3px rgba(37,99,235,.15)}
  .ann-linkform .r,.ann-chippop .r{display:flex;gap:6px;align-items:center}
  .ann-linkform .err{flex:1;color:#e1251b;font-size:11px}
  .ann-linkform button,.ann-chippop button{border:1px solid #d8d8de;background:#fff;border-radius:6px;font:inherit;font-size:12px;cursor:pointer;padding:4px 10px;color:#0e0e10}
  .ann-linkform button.p{background:${ACCENT};border-color:${ACCENT};color:#fff}
  .ann-chippop{padding:8px;max-width:420px}
  .ann-chippop .u{flex:1;min-width:0;color:#1155cc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px;text-decoration:none}
  .ann-chippop .u:hover{text-decoration:underline}
  .ann-chippop .del{color:#e1251b}`;
  function ensureLinkCSS(doc) {
    if (doc.getElementById("ann-linkform-css")) return;
    const st = doc.createElement("style"); st.id = "ann-linkform-css"; st.textContent = LINKFORM_CSS; doc.head.appendChild(st);
  }
  function closeLinkUI(doc) { doc.querySelectorAll(".ann-linkform,.ann-chippop").forEach((n) => n.remove()); }
  const placeAt = (doc, box, x, y) => {
    const win = doc.defaultView, W = box.offsetWidth, H = box.offsetHeight;
    box.style.left = Math.max(8, Math.min(x, win.innerWidth - W - 8)) + "px";
    box.style.top = Math.max(8, y + H > win.innerHeight - 8 ? y - H - 36 : y) + "px";
  };
  // Opens the Title + URL dialog at (x, y) in `doc`; onApply(title, url) runs with a valid http(s) URL.
  function linkForm(doc, x, y, init, onApply, onCancel) {
    ensureLinkCSS(doc); closeLinkUI(doc);
    const f = doc.createElement("div");
    f.className = "ann-linkform"; f.setAttribute("data-annotator-ui", "");
    f.innerHTML = `<h5>${init.url ? "Edit link" : "Insert link"}</h5>
      <label>Title<input name="t" placeholder="e.g. Team Store Creation Flow"></label>
      <label>Link<input name="u" placeholder="Paste a URL — https://…"></label>
      <div class="r"><span class="err"></span><button data-a="c">Cancel</button><button data-a="s" class="p">Apply</button></div>`;
    const ti = f.querySelector('[name="t"]'), ui = f.querySelector('[name="u"]'), err = f.querySelector(".err");
    ti.value = init.title || ""; ui.value = init.url || "";
    doc.body.appendChild(f); placeAt(doc, f, x, y);
    const close = (cancelled) => { f.remove(); if (cancelled && onCancel) onCancel(); };
    const apply = () => {
      let url = ui.value.trim();
      if (url && !/^https?:\/\//i.test(url) && /^[\w-]+(\.[\w-]+)+/.test(url)) url = "https://" + url; // "figma.com/…" → https://figma.com/…
      if (!/^https?:\/\/\S+$/i.test(url)) { err.textContent = "Enter a valid link (https://…)"; ui.focus(); return; }
      close(false); onApply(ti.value.trim(), url);
    };
    f.addEventListener("click", (e) => { const a = e.target.closest("button")?.dataset.a; if (a === "s") apply(); if (a === "c") close(true); });
    f.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); apply(); }
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); }
    });
    setTimeout(() => (init.url && !init.title ? ti : init.url ? ti : ui).focus(), 0);
    return f;
  }
  const plainText = (text) => linkParts(String(text == null ? "" : text).replace(HL_RE, "$2").replace(BOLD_RE, "$1")).map((p) => (typeof p === "string" ? p : p.title)).join("");
  const CHIP_CSS = `.ann-chip{display:inline-flex;align-items:center;gap:5px;max-width:100%;vertical-align:baseline;padding:1px 8px 1px 3px;margin:1px 0;border:1px solid #dadce0;border-radius:12px;background:#f1f3f4;color:#1f1f1f;font-size:.92em;font-weight:500;line-height:1.5;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
  .ann-chip:hover{background:#e8eaed;border-color:#c4c7cc}
  .ann-ic{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 3px;border-radius:4px;color:#fff;font-size:8px;font-weight:800;letter-spacing:.02em}
  @media print{.ann-chip{border-color:#c8c8c8;-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;

  // ---------- FRD (Functional Requirements Document) ----------
  // Header fields, versions, section titles, phased-in rows and references are edited in the
  // report window itself and remembered in localStorage (shared by every page on the site).
  const META_KEY = "annotator-frd";
  const META_FIELDS = { project: "", type: "Change Request", stakeholder: "", uiux: "", ba: "", pm: "", dev: "", sqa: "", other: "", priority: "", brand: "" };
  const REFS = ["Final Design Figma Link", "Monday ticket", "Hand-off Video", "Technical Specs", "JIRA Ticket"];
  const loadMeta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}"); } catch { return {}; } };
  const saveMeta = (m) => { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch {} };

  function frdDefaults(groups, date) {
    // Project name defaults to the words every page name starts with ("Team Stores Workspace" + "Team Stores Landing" → "Team Stores").
    const names = groups.flatMap((g) => g.pages || [g.page]);
    const words = names.map((n) => n.split(/\s+/));
    const common = [];
    for (let i = 0; words.every((w) => w[i] && w[i] === words[0][i]); i++) common.push(words[0][i]);
    const d = Object.assign({}, META_FIELDS, {
      project: (names.length > 1 && common.length ? common.join(" ") : names[0]).replace(/\s*[-–—]\s*$/, ""),
      "ver:title": "v1.0.0 - Minor Release", "ver:0:0": "v1.0.0", "ver:0:1": "n/a", "ver:0:2": "INITIAL RELEASE", "ver:0:3": date,
    });
    return d;
  }

  // First line of a note = requirement title; remaining lines = description ("-", "•", "*" lines become bullets).
  // Lines keep their indent level (sub-bullets / indented sub-module text).
  function splitBody(body) {
    const lines = String(body || "").split("\n").filter((l) => l.trim());
    return {
      title: (lines[0] || "").trim(),
      lines: lines.slice(1).map(lineInfo),
    };
  }

  // Report only: cuts empty rows (plain background, one color across) off the bottom of a screenshot, keeping a
  // small margin — so older, taller screenshots don't leave white space under the element. The stored copy is unchanged.
  function trimBottom(shot) {
    if (!shot || !shot.src) return Promise.resolve(shot);
    return new Promise((res) => {
      const img = new Image();
      img.onerror = () => res(shot);
      img.onload = () => {
        try {
          const W = img.naturalWidth, H = img.naturalHeight, c = document.createElement("canvas");
          c.width = W; c.height = H; const g = c.getContext("2d"); g.drawImage(img, 0, 0);
          const px = g.getImageData(0, 0, W, H).data, step = Math.max(1, Math.floor(W / 300)), tol = 14;
          const blank = (y) => { const o = y * W * 4, r0 = px[o], g0 = px[o + 1], b0 = px[o + 2];
            for (let x = 0; x < W; x += step) { const i = o + x * 4; if (Math.abs(px[i] - r0) > tol || Math.abs(px[i + 1] - g0) > tol || Math.abs(px[i + 2] - b0) > tol) return false; } return true; };
          let y = H - 1; while (y > 0 && blank(y)) y--;
          const keep = Math.min(H, y + 1 + Math.round(H * 0.02) + 12);
          if (H - keep < 24) return res(shot); // nothing worth trimming
          const o = document.createElement("canvas"); o.width = W; o.height = keep;
          o.getContext("2d").drawImage(img, 0, 0, W, keep, 0, 0, W, keep);
          res(Object.assign({}, shot, { src: o.toDataURL("image/jpeg", 0.9), h: Math.round(shot.h * keep / H) }));
        } catch { res(shot); }
      };
      img.src = shot.src;
    });
  }

  // Draws the numbered callout (label + title, arrow, dashed outline) onto the raw screenshot, like the on-page callout.
  function compose(shot, label, title) {
    if (!shot || !shot.box || shot.card) return Promise.resolve(shot); // .card = the real callout is already in the image
    return new Promise((res) => {
      const img = new Image();
      img.onerror = () => res(shot);
      img.onload = () => {
        const c = document.createElement("canvas"); c.width = shot.w; c.height = shot.h;
        const ctx = c.getContext("2d"), b = shot.box, u = shot.w / 900;
        ctx.drawImage(img, 0, 0);
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2 * u; ctx.setLineDash([6 * u, 4 * u]);
        ctx.strokeRect(b.x - 4 * u, b.y - 4 * u, b.w + 8 * u, b.h + 8 * u); ctx.setLineDash([]);

        const t = title.length > 70 ? title.slice(0, 67) + "…" : title;
        ctx.font = `700 ${11 * u}px Inter, system-ui, sans-serif`;
        const pw = ctx.measureText(label).width + 14 * u;
        ctx.font = `500 ${12.5 * u}px Inter, system-ui, sans-serif`;
        const tw = Math.min(ctx.measureText(t).width, c.width - pw - 60 * u);
        const bw = pw + tw + 28 * u, bh = 30 * u, gap = 30 * u;
        let bx = Math.min(Math.max(8 * u, b.x), c.width - bw - 8 * u), by = b.y - bh - gap, above = true;
        if (by < 8 * u) { by = b.y + b.h + gap; above = false; }
        if (by + bh > c.height - 8 * u) { by = Math.max(8 * u, b.y + 8 * u); above = null; } // no room: overlay inside

        if (above !== null) {
          const sx = bx + Math.min(bw / 2, 60 * u), sy = above ? by + bh : by;
          const ex = Math.max(b.x + 6 * u, Math.min(sx + 30 * u, b.x + b.w - 6 * u)), ey = above ? b.y - 5 * u : b.y + b.h + 5 * u;
          ctx.strokeStyle = ACCENT; ctx.lineWidth = 2 * u;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx, ey, ex, ey); ctx.stroke();
          const dir = ex >= sx ? 1 : -1;
          ctx.fillStyle = ACCENT; ctx.beginPath();
          ctx.moveTo(ex, ey); ctx.lineTo(ex - dir * 8 * u, ey - 4.5 * u); ctx.lineTo(ex - dir * 8 * u, ey + 4.5 * u); ctx.closePath(); ctx.fill();
        }
        const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); };
        ctx.save(); ctx.shadowColor = "rgba(20,20,40,.22)"; ctx.shadowBlur = 12 * u; ctx.shadowOffsetY = 3 * u;
        rr(bx, by, bw, bh, 7 * u); ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5 * u; rr(bx, by, bw, bh, 7 * u); ctx.stroke();
        rr(bx + 8 * u, by + 7 * u, pw, 16 * u, 8 * u); ctx.fillStyle = ACCENT; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.font = `700 ${11 * u}px Inter, system-ui, sans-serif`;
        ctx.fillText(label, bx + 15 * u, by + 15.5 * u);
        ctx.fillStyle = "#0e0e10"; ctx.font = `500 ${12.5 * u}px Inter, system-ui, sans-serif`;
        ctx.fillText(t, bx + pw + 16 * u, by + 15.5 * u, tw);
        res({ src: c.toDataURL("image/jpeg", 0.88), w: c.width, h: c.height });
      };
      img.src = shot.src;
    });
  }

  // Everything the report / Word file shows, built from the stored notes + screenshots. capture=false skips taking
  // new screenshots (used by background auto-updates of a linked file).
  // mod = a module number (FR-1.1 … FR-1.6 → module 1, shown as M-1.0) to report only that module; null = everything.
  async function collectReport(pages, status = () => {}, capture = true, mod = null) {
    pages = uniquePages(pages);
    const groups = [], extras = await extraAll(), renum = frRenumber();
    let missing = 0;
    for (const [gi, pg] of pages.entries()) {
      const all = frItems(pg, gi).map((x) => Object.assign(x, { fr: renum.map.get(x.n.id) || x.fr }));
      const frById = renum.map;
      const items = mod == null ? all : all.filter((x) => modOf(x.fr) === mod);
      if (!items.length) continue;
      const rows = [];
      for (const [idx, x] of items.entries()) {
        status("Collecting screenshots… " + (idx + 1) + " / " + items.length + (pages.length > 1 ? " (" + pg.page + ")" : ""));
        let shot = await shotGet(pg.page, x.n.id);
        // Only this page's elements can be captured now: take missing screenshots, and retake older ones that
        // don't show the real callout box yet or came from a buggy version (if that element is on screen).
        if (capture && pg.page === PAGE && (!shot || !shot.card || shot.v !== SHOT_V)) shot = (await snap(x.n)) || shot;
        if (!shot) missing++;
        const fr = frById.get(x.n.id), parts = splitBody(x.n.body);
        parts.hls = [parts.title].concat(parts.lines.map((l) => l.text)).flatMap((txt) => hlParts(txt).filter((sg) => sg.hl).map((sg) => plainText(sg.text)));
        parts.plainTitle = plainText(parts.title);
        rows.push({
          fr, k: numKey(fr), at: Date.parse(x.n.created) || 0, title: parts.title, sub: x.n.sub || "", lines: parts.lines, hls: parts.hls,
          target: x.n.manual ? "" : x.n.tag + (x.n.text ? " · “" + x.n.text + "”" : ""),
          next: (x.n.links || []).map((id) => frById.get(id)).filter(Boolean),
          shot: shot && (await trimBottom(await compose(shot, fr, parts.plainTitle))),
          extras: await Promise.all(extras.filter((e) => e.note === x.n.id).sort((a, b) => String(a.at).localeCompare(String(b.at))).map(trimBottom)),
        });
      }
      groups.push({ page: pg.page, no: gi + 1, rows });
    }
    // One list for all pages, in FR order (FR-1.6 on Landing → FR-1.7 on Workspace), no page headers.
    const byPage = groups.splice(0);
    if (byPage.length) groups.push({ page: byPage.map((g) => g.page).join(" + "), pages: byPage.map((g) => g.page), rows: byPage.flatMap((g) => g.rows).sort((a, b) => numCmp(a.k, b.k) || a.at - b.at) });
    const inReport = new Set(groups.flatMap((g) => g.rows.map((r) => r.fr)));
    groups.renum = renum.changed.filter((c) => inReport.has(c.to));
    groups.renumAll = renum.changed;
    groups.mod = mod;
    // FR numbers still used by more than one note (typed twice in No.) — flagged in the report so they can be fixed.
    const cnt = new Map(); groups.forEach((g) => g.rows.forEach((r) => cnt.set(r.fr, (cnt.get(r.fr) || 0) + 1)));
    groups.dups = [...cnt].filter(([, c]) => c > 1).map(([fr, c]) => ({ fr, c }));
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const defs = groups.length ? frdDefaults(groups, date) : {};
    const meta = loadMeta();
    const val = (k) => (meta[k] != null ? meta[k] : defs[k] != null ? defs[k] : "");
    return { groups, missing, meta, val };
  }

  async function openReport(pages, mod = null) {
    // Open the window synchronously (inside the click) so pop-up blockers allow it.
    const w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups for this page to open the report."); return; }
    w.document.write('<title>Preparing requirements document…</title><p id="s" style="font:14px system-ui;padding:40px;color:#444">Preparing requirements document…</p>');
    const status = (t) => { const el = w.document.getElementById("s"); if (el) el.textContent = t; };
    const { groups, missing, meta, val } = await collectReport(pages, status, true, mod);
    if (!groups.length) { w.close(); alert("No notes in " + modName(mod) + "."); return; }
    const count = groups.reduce((t, g) => t + g.rows.length, 0);

    w.document.open();
    w.document.write(frdHTML({ val, groups, count, missing }));
    w.document.close();
    const d = w.document;
    const docTitle = () => plainText(val("project")) + (mod != null ? " " + modName(mod) : "") + " — Requirements Document";
    d.title = docTitle();
    // Editable cells show links as chips; while a cell is being edited it shows the raw text (URLs / [Title](url)).
    ensureLinkCSS(d);
    const setCell = (el, text) => {
      const k = el.dataset.k, m = loadMeta(); m[k] = text; saveMeta(m); meta[k] = text; autoUpdateSoon();
      if (d.activeElement !== el) el.innerHTML = linkifyHTML(text); else el.textContent = text;
    };
    // Caret/selection as character offsets inside a (plain-text, being edited) cell.
    const caretIn = (el) => {
      const sel = w.getSelection(); if (!sel.rangeCount || !el.contains(sel.anchorNode)) { const n = el.innerText.length; return [n, n]; }
      const r = sel.getRangeAt(0), pre = d.createRange(); pre.selectNodeContents(el); pre.setEnd(r.startContainer, r.startOffset);
      const s = pre.toString().length; return [s, s + r.toString().length];
    };
    const cellLink = (el, x, y) => {
      const text = el.innerText.replace(/\n$/, ""), [s, en] = caretIn(el), hit = linkAt(text, s, en);
      linkForm(d, x, y, hit ? { title: hit.label, url: hit.url } : { title: text.slice(s, en).trim(), url: "" },
        (title, url) => { el.blur(); setCell(el, applyLink(text, s, en, hit, title, url)); });
    };
    d.getElementById("lnk").addEventListener("mousedown", (e) => e.preventDefault()); // keep the cell focused
    d.getElementById("lnk").onclick = (e) => {
      const el = d.activeElement && d.activeElement.closest && d.activeElement.closest("[data-k]");
      const r = e.currentTarget.getBoundingClientRect();
      if (!el) { w.alert("Click into a white cell first (e.g. References → Location), then click “Insert link”."); return; }
      const cr = el.getBoundingClientRect(); cellLink(el, cr.left, cr.bottom + 6); void r;
    };
    d.addEventListener("mousedown", (e) => { if (!e.target.closest(".ann-linkform,.ann-chippop,a.ann-chip")) d.querySelectorAll(".ann-chippop").forEach((n) => n.remove()); });
    d.querySelectorAll("[data-k]").forEach((el) => {
      const k = el.dataset.k;
      // Clicking a chip (cell not being edited) shows a small popup: Open · Edit · Remove.
      el.addEventListener("mousedown", (e) => {
        const a = e.target.closest("a.ann-chip");
        if (!a || d.activeElement === el) return;
        e.preventDefault();
        closeLinkUI(d);
        const i = +a.dataset.i, link = linkList(val(k))[i]; if (!link) return;
        const pop = d.createElement("div"); pop.className = "ann-chippop";
        pop.innerHTML = `<div class="r"><a class="u" href="${esc(link.url)}" target="_blank" rel="noopener" title="${esc(link.url)}">${esc(link.url)}</a>
          <button data-a="open">Open</button><button data-a="edit">Edit</button><button data-a="del" class="del">Remove</button></div>`;
        d.body.appendChild(pop);
        const ar = a.getBoundingClientRect(); placeAt(d, pop, ar.left, ar.bottom + 6);
        pop.addEventListener("click", (ev) => {
          const act = ev.target.closest("button")?.dataset.a; if (!act) return;
          pop.remove();
          const text = val(k);
          if (act === "open") w.open(link.url, "_blank", "noopener");
          if (act === "del") setCell(el, (text.slice(0, link.start) + text.slice(link.end)).replace(/[ \t]{2,}/g, " ").trim());
          if (act === "edit") linkForm(d, ar.left, ar.bottom + 6, { title: link.label, url: link.url }, (title, url) => setCell(el, applyLink(text, 0, 0, link, title, url)));
        });
        a.addEventListener("click", (ev) => ev.preventDefault(), { once: true });
      });
      el.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); const cr = el.getBoundingClientRect(); cellLink(el, cr.left, cr.bottom + 6); }
      });
      el.addEventListener("focus", () => { if (el.querySelector("a")) el.textContent = val(k); });
      el.addEventListener("blur", () => { el.innerHTML = linkifyHTML(val(k)); });
      el.addEventListener("paste", (e) => { e.preventDefault(); d.execCommand("insertText", false, e.clipboardData.getData("text/plain")); });
      el.addEventListener("input", () => {
        const m = loadMeta(); m[k] = el.innerText.trim(); saveMeta(m); meta[k] = m[k]; autoUpdateSoon();
        if (k === "project") d.title = docTitle();
      });
    });
    // Links inside the (non-editable) requirement rows open normally; target=_blank already set.
    d.getElementById("pdf").onclick = () => w.print();
    if (d.getElementById("renapply")) d.getElementById("renapply").onclick = (e) => {
      const all = groups.renumAll || [];
      if (!w.confirm("Save the new numbers into the notes (" + all.length + " note" + (all.length === 1 ? "" : "s") + ")?\n\n" + all.slice(0, 20).map((c) => "  " + c.from + " → " + c.to).join("\n") + (all.length > 20 ? "\n  …" : ""))) return;
      applyNums(all); e.target.textContent = "✓ Saved to notes"; e.target.disabled = true;
    };
    // ✎ Edit caption: multi-line, bullets like notes (Tab / Shift+Tab, Enter continues a bullet), ⌘/Ctrl+Enter saves.
    d.querySelectorAll(".xed").forEach((b) => { b.onclick = () => {
      const tr = b.closest("[data-x]"), id = tr.dataset.x;
      let ex = null, fr = ""; groups.forEach((g) => g.rows.forEach((r) => { const xi = r.extras.findIndex((x) => x.id === id); if (xi >= 0) { ex = r.extras[xi]; fr = xNo(r.fr, xi); } }));
      if (!ex) return;
      const ov = d.createElement("div"); ov.className = "xcapform";
      ov.innerHTML = `<div class="cb"><h4>Caption · ${esc(fr)}</h4><p>First line goes next to ${esc(fr)}; next lines are the description. “- ” starts a bullet · Tab / Shift+Tab = sub-bullet / back · ${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"}+Enter saves.</p>
        <textarea></textarea><div class="ca"><button data-a="no">Cancel</button><button class="pr" data-a="yes">Save</button></div></div>`;
      const ta = ov.querySelector("textarea"); ta.value = ex.caption || ""; bulletKeys(ta);
      const close = () => ov.remove();
      const saveCap = async () => {
        ex.caption = ta.value.replace(/\s+$/, "").replace(/^\s*\n/, "");
        await extraPut(Object.assign({}, ex));
        tr.querySelector(".capw").outerHTML = capHTML(fr, ex.caption);
        close(); autoUpdateSoon();
      };
      ov.addEventListener("click", (e) => { const a = e.target.closest("[data-a]")?.dataset.a; if (a === "yes") saveCap(); else if (a === "no" || e.target === ov) close(); });
      ta.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(); } if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveCap(); } });
      d.body.appendChild(ov); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
    }; });
    d.querySelectorAll(".xdel").forEach((b) => { b.onclick = async () => {
      const blk = b.closest("[data-x]"), id = blk.dataset.x, tr = blk.closest("tr");
      if (!w.confirm("Remove this screenshot from the report? (The page and its notes are not changed.)")) return;
      await extraDel(id); blk.remove(); if (!tr.querySelector("[data-x]")) { tr.previousElementSibling?.querySelector("td.frno")?.removeAttribute("rowspan"); tr.remove(); }
      groups.forEach((g) => g.rows.forEach((r) => {
        if (!r.extras.some((e) => e.id === id)) return;
        r.extras = r.extras.filter((e) => e.id !== id);
        if (tr.isConnected) tr.querySelectorAll(".xfr").forEach((el, xi) => { el.textContent = xNo(r.fr, xi); });
      }));
      autoUpdateSoon();
    }; });
    // Highlight navigation: the "To check" list and the toolbar button jump to each highlight in the FR rows.
    const marks = () => Array.from(d.querySelectorAll(".req mark.ann-mark"));
    let hlAt = -1;
    const goHL = (i) => {
      const ms = marks(); if (!ms.length) return;
      hlAt = ((i % ms.length) + ms.length) % ms.length;
      const m = ms[hlAt]; m.scrollIntoView({ behavior: "smooth", block: "center" });
      m.classList.remove("flash"); void m.offsetWidth; m.classList.add("flash");
    };
    if (d.getElementById("hlnav")) {
      d.getElementById("hlnav").onclick = () => goHL(hlAt + 1);
      d.querySelectorAll(".tocheck li").forEach((li, i) => { li.onclick = () => goHL(i); });
      d.getElementById("hlexp").onchange = (e) => d.body.classList.toggle("nohl", !e.target.checked);
    }
    // Linked Word file: pick a file once, then every update overwrites that same file (same name, same share
    // link if it's in a synced Google Drive / OneDrive / Dropbox folder) instead of downloading a new copy.
    const scope = Object.assign(pages.length > 1 ? { scope: "all" } : { scope: "page", page: pages[0].page }, { mod });
    const docName = () => ((plainText(val("project")) || "Team Store") + (mod != null ? " " + modName(mod) : "")).replace(/[\\/:*?"<>|]/g, "-") + " - Requirements Document.docx";
    const hlOnNow = () => !d.getElementById("hlexp") || d.getElementById("hlexp").checked;
    const lk = d.getElementById("lk");
    const renderLk = async (msg) => {
      if (!w.showSaveFilePicker) { lk.innerHTML = '<button disabled title="Linking a file needs Chrome or Edge on a computer">🔗 Link a Word file</button>'; return; }
      const rec = await linkGet();
      if (!rec) { lk.innerHTML = '<button id="lkset" title="Pick (or create) a .docx once — later updates overwrite that same file instead of downloading new copies">🔗 Link Word file…</button>'; }
      else {
        lk.innerHTML = `<button id="lkup" class="lk" title="Overwrite “${esc(rec.name)}” with the current notes${rec.at ? " · last updated " + esc(new Date(rec.at).toLocaleString()) : ""}">⟳ Update linked doc</button>
          <label title="Re-save the linked file automatically a few seconds after any note or report field changes"><input type="checkbox" id="lkauto" ${rec.auto !== false ? "checked" : ""}> Auto</label>
          <button id="lkoff" class="lnk" title="Stop updating this file (the file itself is kept)">Unlink</button>`;
      }
      if (msg) { const sp = d.createElement("span"); sp.className = "lkmsg"; sp.textContent = msg; lk.appendChild(sp); setTimeout(() => sp.remove(), 4000); }
    };
    renderLk();
    lk.addEventListener("click", async (e) => {
      const id = e.target.closest("button")?.id; if (!id) return;
      try {
        if (id === "lkset") {
          const handle = await w.showSaveFilePicker({ suggestedName: docName(), types: [{ description: "Word document", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] } }] });
          const rec = Object.assign({ handle, name: handle.name, auto: true, hlOn: hlOnNow() }, scope);
          await writeBlob(handle, await buildDocx({ val, groups, hlOn: rec.hlOn }));
          rec.at = new Date().toISOString(); await linkPut(rec); updateDocBtn();
          renderLk("✓ Linked and saved");
        }
        if (id === "lkup") {
          const rec = await linkGet(); if (!rec) return renderLk();
          if (!(await ensurePerm(rec.handle, true))) return renderLk("Permission denied");
          Object.assign(rec, scope, { hlOn: hlOnNow() });
          await writeBlob(rec.handle, await buildDocx({ val, groups, hlOn: rec.hlOn }));
          rec.at = new Date().toISOString(); await linkPut(rec); updateDocBtn();
          renderLk("✓ Updated");
        }
        if (id === "lkoff") { await linkDel(); updateDocBtn(); renderLk("Unlinked — the file is kept"); }
      } catch (err) { if (err && err.name !== "AbortError") renderLk("Couldn't save: " + err.message); }
    });
    lk.addEventListener("change", async (e) => {
      if (e.target.id !== "lkauto") return;
      const rec = await linkGet(); if (rec) { rec.auto = e.target.checked; await linkPut(rec); }
    });
    d.getElementById("docx").onclick = async (e) => {
      const btn = e.currentTarget; btn.disabled = true; btn.textContent = "Building…";
      const hlOn = !d.getElementById("hlexp") || d.getElementById("hlexp").checked;
      try { download(await buildDocx({ val, groups, hlOn }), docName()); }
      catch (err) { w.alert("Couldn't build the Word file: " + err.message); }
      btn.disabled = false; btn.textContent = "⬇ Word";
    };
  }

  // Caption under a ⌘⇧ screenshot: "FR-1.2 · first line", then the rest as a description with bullets.
  function capHTML(fr, caption) {
    const c = capParts(caption);
    return `<div class="capw">${c.head ? `<div class="cap">${linkifyHTML(c.head)}</div>` : ""}${c.lines.length ? `<div class="capd desc">${descHTML({ lines: c.lines, next: [] })}</div>` : ""}</div>`;
  }
  function descHTML(r) {
    let h = "", ul = [];
    const flush = () => { if (ul.length) { h += "<ul>" + ul.join("") + "</ul>"; ul = []; } };
    r.lines.forEach((l) => {
      if (l.bullet) ul.push(`<li class="lv${l.level}">` + linkifyHTML(l.text) + "</li>");
      else { flush(); h += `<p${l.level ? ` style="margin-left:${l.level * 18}px"` : ""}>` + linkifyHTML(l.text) + "</p>"; }
    });
    flush();
    if (r.next.length) h += `<p class="nx">Next: ${esc(r.next.join(", "))}</p>`;
    return h || '<p class="mut">—</p>';
  }

  function frdHTML({ val, groups, count, missing }) {
    const dups = groups.dups || [], dupSet = new Set(dups.map((d) => d.fr));
    const hlCount = groups.reduce((t, g) => t + g.rows.reduce((u, r) => u + r.hls.length, 0), 0);
    const ed = (k, attrs) => `<td class="ed" contenteditable="true" data-k="${esc(k)}"${attrs || ""}>${linkifyHTML(val(k))}</td>`;
    const lb = (t, attrs) => `<td class="lb"${attrs || ""}>${esc(t)}</td>`;
    const verRows = [0, 1, 2].map((r) => `<tr>${[0, 1, 2, 3].map((c) => ed("ver:" + r + ":" + c, ' class="c"')).join("")}</tr>`).join("");
    const phRows = [0, 1].map((r) => `<tr>${[0, 1, 2, 3].map((c) => ed("ph:" + r + ":" + c)).join("")}</tr>`).join("");
    const fr = groups.map((g) => `<tbody class="sec">` +
      g.rows.map((r) => `
        ${r.shot ? `<tr class="shot"><td colspan="3"><img src="${r.shot.src}" alt="${esc(r.fr)}"></td></tr>` : ""}
        <tr class="req"><td class="frno${dupSet.has(r.fr) ? " dup" : ""}"${r.extras.length ? ' rowspan="2"' : ""}${dupSet.has(r.fr) ? ' title="This FR number is used by more than one note — change one in its No. field"' : ""}>${esc(r.fr)}</td><td class="ttl"><b>${linkifyHTML(r.title)}</b>${r.sub ? `<div class="sub">${linkifyHTML(r.sub)}</div>` : ""}<div class="el">${esc(r.target)}</div></td><td class="desc">${descHTML(r)}</td></tr>
        ${r.extras.length ? `<tr class="xshot"><td class="xim" colspan="2">${r.extras.map((e, xi) => `<div class="xblk" data-x="${esc(e.id)}"><div class="xfr">${esc(xNo(r.fr, xi))}</div><img src="${e.src}" alt="${esc(xNo(r.fr, xi))}" style="width:${extraSize(e).w}px;height:${extraSize(e).h}px">${capHTML(r.fr, e.caption)}<div class="xbtns"><button class="xed" title="Edit this screenshot's caption (bullets like notes)">✎ Edit caption</button><button class="xdel" title="Remove this extra screenshot from the report">✕ Remove</button></div></div>`).join("")}</td></tr>` : ""}`).join("") + "</tbody>").join("");
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Requirements Document</title>
<style>
  @page{size:A4;margin:14mm}
  *{box-sizing:border-box}
  body{margin:0;background:#eef0f3;color:#111;font:13px/1.45 Calibri,Carlito,Arial,sans-serif}
  .bar{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:space-between;padding:6px 16px;background:#fff;border-bottom:1px solid #e5e5e9;font:12px/1.3 Inter,system-ui,sans-serif}
  .bar .grp{display:flex;flex-wrap:wrap;gap:6px;align-items:center;min-width:0}
  .bar .grp > *{white-space:nowrap}
  .bar .sp{color:#6b6b72;gap:10px}
  .bar .sp b{color:#0e0e10}
  .bar .warn{color:#9a5b00;background:#fff4e0;border-radius:9px;padding:1px 7px}
  .bar .dupw{color:#b42318;background:#fee4e2}
  .bar .renw{color:#1d4ed8;background:#e8efff;cursor:help}
  td.frno.dup{color:#b42318;background:#fee4e2}
  @media print{td.frno.dup{color:inherit;background:none}}
  .bar .tip{cursor:help;color:#6b6b72;border-bottom:1px dotted #9a9aa1}
  .bar .sep{width:1px;height:18px;background:#e5e5e9;margin:0 2px}
  .bar button.hl{background:#fde047;border-color:#e8c40c}
  .bar button{font:inherit;font-size:12px;border:1px solid #d8d8de;background:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;white-space:nowrap}
  .bar button.p{background:${ACCENT};border-color:${ACCENT};color:#fff}
  #lk{display:inline-flex;gap:6px;align-items:center}
  #lk button.lk{border-color:${ACCENT};color:${ACCENT};font-weight:600;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #lk button.lnk{border:0;background:none;color:#6b6b72;text-decoration:underline;padding:4px 2px}
  #lk label{white-space:nowrap}
  #lk .lkmsg{font-size:12px;color:#1f7a44;font-weight:600}
  main{max-width:880px;margin:24px auto;background:#fff;padding:36px 40px;box-shadow:0 2px 12px rgba(20,20,40,.08)}
  h1{font-size:14px;text-align:center;margin:0 0 14px;letter-spacing:.02em}
  table{width:100%;border-collapse:collapse;margin:0 0 12px;table-layout:fixed}
  td{border:1px solid #bfbfbf;padding:5px 8px;vertical-align:top;word-wrap:break-word}
  .lb{background:#d9d9d9;font-weight:700}
  .th td{background:#ececec;font-weight:700;text-align:center}
  .c{text-align:center}
  .ed{min-height:24px;outline:none}
  .ed:hover{background:#fffbe6}
  .ed:focus{background:#fff8d6;box-shadow:inset 0 0 0 2px #f2c94c}
  .ed:empty::before{content:"\\00a0"}
  .sub{font-weight:400;margin-top:4px}
  .sh{background:#d9d9d9;font-weight:700}
  .shot td{padding:10px;text-align:center}
  .shot img{max-width:100%;max-height:520px;border:1px solid #d0d0d0}
  .xshot td{position:relative;vertical-align:top}
  .xshot td.xim{padding:10px;text-align:left}
  .xshot .xblk{position:relative}
  .xshot .xblk + .xblk{margin-top:14px;padding-top:12px;border-top:1px dashed #d0d0d0}
  .xshot .xfr{color:#555;font-size:12px;font-weight:700;margin:0 0 6px}
  .xshot img{display:block;max-width:100%;object-fit:contain;border:1px solid #d0d0d0}
  .xshot .cap{color:#333;font-weight:600;margin-top:8px}
  .xshot .capd{color:#333;margin-top:4px}
  .xshot .xbtns{position:absolute;top:0;right:0;display:flex;gap:6px;opacity:0;transition:opacity .15s}
  .xshot .xbtns button{font:12px Inter,system-ui,sans-serif;border:1px solid #d8d8de;background:#fff;border-radius:6px;padding:3px 8px;cursor:pointer;color:#0e0e10}
  .xshot .xbtns .xdel{color:#b42318}
  .xshot .xblk:hover .xbtns{opacity:1}
  .xcapform{position:fixed;inset:0;z-index:50;background:rgba(14,14,16,.38);display:flex;align-items:center;justify-content:center;font:13px Inter,system-ui,sans-serif}
  .xcapform .cb{background:#fff;border-radius:12px;padding:16px;width:520px;max-width:calc(100vw - 32px);box-shadow:0 14px 40px rgba(20,20,40,.3)}
  .xcapform h4{margin:0 0 4px;font-size:14px}.xcapform p{margin:0 0 10px;color:#666;font-size:12px}
  .xcapform textarea{width:100%;box-sizing:border-box;min-height:140px;font:13px/1.45 Inter,system-ui,sans-serif;border:1px solid #d8d8de;border-radius:8px;padding:8px 10px;resize:vertical;tab-size:2;outline:none}
  .xcapform textarea:focus{border-color:#2563eb}
  .xcapform .ca{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}
  .xcapform button{font:inherit;border:1px solid #d8d8de;background:#fff;border-radius:6px;padding:5px 12px;cursor:pointer}
  .xcapform .pr{background:#2563eb;border-color:#2563eb;color:#fff}
  .frno{font-weight:700;white-space:nowrap}
  .ttl .el{color:#7a7a7a;font-size:11px;margin-top:3px}
  .ttl .sub{color:#444;font-style:italic;margin-top:2px}
  .desc p{margin:0 0 4px}.desc ul{margin:0 0 4px;padding-left:18px}
  .desc li.lv1{margin-left:18px;list-style-type:circle}.desc li.lv2{margin-left:36px;list-style-type:square}
  .nx{color:#555;font-size:12px}.mut{color:#aaa}
  ${HL_CSS}
  mark.ann-mark.flash{animation:annFlash 1.4s ease 2}
  @keyframes annFlash{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0)}50%{box-shadow:0 0 0 5px rgba(245,158,11,.55)}}
  .tocheck{border:1px solid #f5d565;background:#fffbea;border-radius:8px;padding:12px 16px;margin:0 0 22px;font-family:Inter,system-ui,sans-serif}
  .tocheck h4{margin:0 0 6px;font-size:13px}
  .tocheck ol{margin:0;padding-left:20px}
  .tocheck li{margin:3px 0;cursor:pointer}
  .tocheck li:hover span{text-decoration:underline}
  .tocheck b{font-size:12px;margin-right:6px}
  .bar label{font-size:12px;color:#444;display:flex;gap:4px;align-items:center;cursor:pointer}
  body.nohl mark.ann-mark{background:none;padding:0}
  ${CHIP_CSS}
  @media print{
    body{background:#fff}
    .bar{display:none}
    .xdel,.xbtns,.xcapform{display:none!important}
    main{margin:0;padding:0;box-shadow:none;max-width:none}
    .ed:hover,.ed:focus{background:none;box-shadow:none}
    .tocheck{display:none}
    .lb,.sh,.th td{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    /* Compact paging: text rows stay whole, but screenshot rows may split between blocks, so a tall row
       never pushes to the next page and leaves the bottom of a page blank. Only an image / one ⌘⇧ block stays whole. */
    tr{break-inside:avoid}
    tr.shot,tr.xshot{break-inside:auto}
    .shot img,.xblk{break-inside:avoid}
    .shot img{max-height:110mm}
    .xshot img{max-height:90mm}
    table{margin-bottom:10px}
  }
</style></head><body>
<div class="bar">
  <div class="grp sp"><b>${count} FR${count === 1 ? "" : "s"}${groups.mod != null ? " · " + esc(modName(groups.mod)) : ""}</b>${missing ? `<span class="warn" title="Open those screens and save the note again to capture a screenshot">${missing} without screenshot</span>` : ""}${dups.length ? `<span class="warn dupw" title="Several notes have the same No. — open All notes → Edit and give each its own number">⚠ Duplicate FR: ${esc(dups.map((d) => d.fr + " (" + d.c + "×)").join(", "))}</span>` : ""}${groups.renum.length ? `<span class="warn renw" title="Same No. on several notes — numbered on in this report so no FR repeats:\n${esc(groups.renum.map((c) => c.from + " → " + c.to).join("\n"))}">↻ ${groups.renum.length} renumbered (no duplicates)</span><button id="renapply" title="Write these numbers into the notes' No. so the boxes on the page match the report">Save numbers to notes</button>` : ""}
    <span class="tip" tabindex="0" title="Click any white cell to edit it — edits are remembered.&#10;🔗 Insert link / ⌘K adds a titled link to the cell you're editing.&#10;For PDF, choose “Save as PDF” in the print dialog.">ⓘ Tips</span></div>
  <div class="grp">
    ${hlCount ? `<button id="hlnav" class="hl" title="Jump to the next highlighted question">🖍 ${hlCount} to check ↓</button><label title="Untick to print / export without the highlights"><input type="checkbox" id="hlexp" checked> Highlights</label><span class="sep"></span>` : ""}
    <button id="lnk" title="Insert a link with a title into the cell you're editing (⌘K)">🔗 Link</button><span class="sep"></span>
    <span id="lk"></span><button id="docx" title="Download a new Word copy">⬇ Word</button><button id="pdf" class="p" title="Opens the print dialog — choose “Save as PDF”">Save as PDF</button>
  </div></div>
<main>
  ${hlCount ? `<div class="tocheck"><h4>🖍 To check — ${hlCount} highlighted item${hlCount === 1 ? "" : "s"}</h4><ol>${groups.flatMap((g) => g.rows.flatMap((r) => r.hls.map((h) => `<li><b>${esc(r.fr)}</b><span>${esc(h)}</span></li>`))).join("")}</ol></div>` : ""}
  <h1>REQUIREMENTS DOCUMENT${groups.mod != null ? " — " + esc(modName(groups.mod)) : ""}</h1>
  <table><colgroup><col style="width:34%"><col style="width:33%"><col style="width:33%"></colgroup>
    <tr>${lb("PROJECT NAME:", ' colspan="2"')}${lb("Type")}</tr>
    <tr>${ed("project", ' colspan="2" style="font-weight:700"')}${ed("type")}</tr>
    <tr>${lb("STAKEHOLDER")}${lb("US UI/UX:", ' colspan="2"')}</tr>
    <tr>${ed("stakeholder")}${ed("uiux", ' colspan="2"')}</tr>
    <tr>${lb("BA AUTHOR:", ' colspan="3"')}</tr><tr>${ed("ba", ' colspan="3"')}</tr>
    <tr>${lb("PROJECT MANAGER:", ' colspan="3"')}</tr><tr>${ed("pm", ' colspan="3"')}</tr>
    <tr>${lb("DEVELOPMENT TEAM: (INCLUDING UI/UX)", ' colspan="3"')}</tr><tr>${ed("dev", ' colspan="3"')}</tr>
    <tr>${lb("SQA TEAM:", ' colspan="3"')}</tr><tr>${ed("sqa", ' colspan="3"')}</tr>
    <tr>${lb("OTHER TEAMS:", ' colspan="3"')}</tr><tr>${ed("other", ' colspan="3"')}</tr>
    <tr>${lb("PRIORITY:")}${lb("BRAND:", ' colspan="2"')}</tr>
    <tr>${ed("priority")}${ed("brand", ' colspan="2"')}</tr>
  </table>
  <table>
    <tr><td class="lb" colspan="4">VERSIONS<div class="sub ed" contenteditable="true" data-k="ver:title">${linkifyHTML(val("ver:title"))}</div></td></tr>
    <tr class="th"><td>VERSION NO.</td><td>BR/FR NO.</td><td>REVISION REMARKS</td><td>LAST UPDATED DATE</td></tr>
    ${verRows}
  </table>
  <table><colgroup><col style="width:13%"><col style="width:27%"><col style="width:60%"></colgroup>
    <tr><td class="lb" colspan="3">FUNCTIONAL REQUIREMENTS (FR)</td></tr>
    ${fr}
  </table>
  <table>
    <tr><td class="lb" colspan="4">PHASED IN REQUIREMENTS</td></tr>
    <tr class="th"><td>FR NO.</td><td>REQUIREMENT</td><td>TARGET PHASE</td><td>REMARKS</td></tr>
    ${phRows}
  </table>
  <table><colgroup><col style="width:30%"><col style="width:70%"></colgroup>
    <tr><td class="lb" colspan="2">REFERENCES</td></tr>
    <tr class="th"><td>NAME</td><td>LOCATION</td></tr>
    ${REFS.map((n, i) => `<tr><td>${esc(n)}</td>${ed("ref:" + i)}</tr>`).join("")}
  </table>
</main></body></html>`;
  }

  async function buildDocx({ val, groups, hlOn = true }) {
    const D = await loadLib(DOCX_URL, "docx");
    // Page geometry and table styling mirror the PDF (@page A4, margin 14mm; td border 1px #bfbfbf, padding 5px 8px).
    const MARGIN = 794; // 14mm in twips
    const FULL = 11906 - 2 * MARGIN; // A4 text width in twips
    const pct = (...p) => { const w = p.map((x) => Math.round((FULL * x) / 100)); w[w.length - 1] += FULL - w.reduce((s, x) => s + x, 0); return w; };
    const line = { style: D.BorderStyle.SINGLE, size: 6, color: "BFBFBF" };
    const borders = { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line };
    // Yellow = a real Word highlight; other colors = shading in the exact color (Word's highlight palette has no orange/pink etc.).
    const hlProps = (o) => !o.hl ? {} : o.hlc && o.hlc !== "yellow" ? { shading: { type: D.ShadingType.CLEAR, fill: hlFill(o.hlc).slice(1), color: "auto" } } : { highlight: "yellow" };
    const run1 = (text, o, bold) => new D.TextRun(Object.assign({ text: text || "", bold: bold || o.bold, italics: o.italics, size: o.size || 20, color: o.color, font: "Calibri" }, hlProps(o)));
    const run = (text, o = {}) => String(text || "").split(/\*\*([^\n*]+?)\*\*/).map((t, i) => run1(t, o, i % 2 === 1)); // odd pieces = **bold**
    // Text with links → runs; each link becomes a clickable, shaded "chip" (icon label + title).
    const runs = (text, o = {}) => hlParts(text).flatMap((seg) => linkRuns(seg.text, Object.assign({}, o, { hl: seg.hl && hlOn, hlc: seg.color })));
    const linkRuns = (text, o = {}) => linkParts(text).flatMap((p) => {
      if (typeof p === "string") return run(p, o);
      const [ic, c] = KINDS[p.kind] || KINDS.link, shade = { type: D.ShadingType.CLEAR, fill: "F1F3F4", color: "auto" };
      return new D.ExternalHyperlink({ link: p.url, children: [
        new D.TextRun({ text: " " + ic + " ", bold: true, size: 14, color: "FFFFFF", font: "Calibri", shading: { type: D.ShadingType.CLEAR, fill: c.slice(1), color: "auto" } }),
        new D.TextRun({ text: " " + p.title + " ", size: o.size || 20, bold: o.bold, color: "1155CC", underline: {}, font: "Calibri", ...(o.hl ? hlProps(o) : { shading: shade }) }),
      ] });
    });
    const para = (text, o = {}) => new D.Paragraph({ alignment: o.center ? D.AlignmentType.CENTER : undefined, indent: o.indent, children: runs(text, o) });
    // Cells are described first and materialised in table(), which knows the column widths (fixed widths keep every table full-width).
    const cell = (children, o = {}) => ({ children: Array.isArray(children) ? children : [children], span: o.span || 1, fill: o.fill, pad: o.pad, split: o.split, vm: o.vm });
    const lbl = (t, span, fill = "D9D9D9") => cell(para(t, { bold: true }), { span, fill });
    const edc = (k, span, o = {}) => cell(para(val(k), o), { span });
    const table = (cols, rows) => new D.Table({
      width: { size: FULL, type: D.WidthType.DXA }, columnWidths: cols, layout: D.TableLayoutType.FIXED, borders,
      rows: rows.map((r) => {
        let col = 0;
        // Text rows stay whole; screenshot rows may split across pages (no blank space at the bottom of a page).
        return new D.TableRow({ cantSplit: !r.some((c) => c.split), children: r.map((c) => {
          const w = cols.slice(col, col + c.span).reduce((s, x) => s + x, 0); col += c.span;
          return new D.TableCell({
            children: c.children, columnSpan: c.span > 1 ? c.span : undefined, verticalMerge: c.vm ? (c.vm === "restart" ? D.VerticalMergeType.RESTART : D.VerticalMergeType.CONTINUE) : undefined, width: { size: w, type: D.WidthType.DXA },
            shading: c.fill ? { fill: c.fill, type: D.ShadingType.CLEAR, color: "auto" } : undefined,
            margins: c.pad || { top: 75, bottom: 75, left: 120, right: 120 },
          });
        }) });
      }),
    });
    const gap = () => new D.Paragraph({ spacing: { before: 0, after: 0, line: 180, lineRule: D.LineRuleType.EXACT }, children: [] }); // 12px, like table margin-bottom
    const thirds = pct(34, 33, 33), quarters = pct(25, 25, 25, 25);

    const kids = [
      new D.Paragraph({ alignment: D.AlignmentType.CENTER, spacing: { after: 210 }, children: runs("REQUIREMENTS DOCUMENT" + (groups.mod != null ? " — " + modName(groups.mod) : ""), { bold: true, size: 22 }) }),
      table(thirds, [
        [lbl("PROJECT NAME:", 2), lbl("Type")], [edc("project", 2, { bold: true }), edc("type")],
        [lbl("STAKEHOLDER"), lbl("US UI/UX:", 2)], [edc("stakeholder"), edc("uiux", 2)],
        [lbl("BA AUTHOR:", 3)], [edc("ba", 3)], [lbl("PROJECT MANAGER:", 3)], [edc("pm", 3)],
        [lbl("DEVELOPMENT TEAM: (INCLUDING UI/UX)", 3)], [edc("dev", 3)], [lbl("SQA TEAM:", 3)], [edc("sqa", 3)],
        [lbl("OTHER TEAMS:", 3)], [edc("other", 3)], [lbl("PRIORITY:"), lbl("BRAND:", 2)], [edc("priority"), edc("brand", 2)],
      ]), gap(),
      table(quarters, [
        [cell([para("VERSIONS", { bold: true }), para(val("ver:title"))], { span: 4, fill: "D9D9D9" })],
        ["VERSION NO.", "BR/FR NO.", "REVISION REMARKS", "LAST UPDATED DATE"].map((t) => cell(para(t, { bold: true, center: true }), { fill: "ECECEC" })),
        ...[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => edc("ver:" + r + ":" + c, undefined, { center: true }))),
      ]), gap(),
    ];

    const frCols = pct(13, 27, 60), frRows = [[lbl("FUNCTIONAL REQUIREMENTS (FR)", 3)]];
    groups.forEach((g) => {
      g.rows.forEach((r) => {
        // Bullets: •/◦/▪ per level with a hanging indent; indented plain lines keep their depth (0.25" per level).
        const wordLines = (lines) => lines.map((l) => l.bullet
          ? new D.Paragraph({ indent: { left: 240 + l.level * 360, hanging: 240 }, children: [
              new D.TextRun({ text: BULLETS[l.level], size: 20, font: "Calibri" }),
              D.Tab ? new D.TextRun({ children: [new D.Tab()] }) : new D.TextRun({ text: "  " }), ...runs(l.text)] })
          : para(l.text, l.level ? { indent: { left: l.level * 360 } } : {}));
        const image = (shot, caption, std, capLines) => {
          const bin = atob(shot.src.split(",")[1]), bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          let W = Math.min(Math.floor((FULL - 300) / 15), shot.w), H = Math.round((shot.h * W) / shot.w); // fit cell width minus 10px padding
          if (std) { const z = extraSize(shot), f = Math.min(1, W / z.w); W = Math.round(z.w * f); H = Math.round(z.h * f); } // extra (⌘⇧) screenshots: standard size
          if (H > 420) { W = Math.round(W * 420 / H); H = 420; } // cap the height (~4.4") so a screenshot never takes most of a page
          const kids = [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.ImageRun({ type: /^data:image\/png/.test(shot.src) ? "png" : "jpg", data: bytes, transformation: { width: W, height: H } })] })];
          if (caption) kids.push(para(caption, { center: true, color: "555555", size: 18 }));
          if (capLines && capLines.length) kids.push(...wordLines(capLines));
          frRows.push([cell(kids, { span: 3, split: true, pad: { top: 100, bottom: 100, left: 150, right: 150 } })]);
        };
        if (r.shot) image(r.shot);
        const desc = wordLines(r.lines);
        if (r.next.length) desc.push(para("Next: " + r.next.join(", "), { color: "555555", size: 18 }));
        const hasX = (r.extras || []).length > 0;
        frRows.push([
          cell(para(r.fr, { bold: true }), hasX ? { vm: "restart" } : {}),
          cell([para(r.title, { bold: true }), ...(r.sub ? [para(r.sub, { italics: true, color: "444444" })] : []), para(r.target, { color: "7A7A7A", size: 16 })]),
          cell(desc.length ? desc : [para("—", { color: "AAAAAA" })]),
        ]);
        // ⌘⇧ extra screenshots: one row under their FR; its FR No. cell is merged into the FR's own (vertical merge) | each screenshot with
        // the FR number as a small header, then the image, then its (bulleted) caption.
        const xk = [];
        (r.extras || []).forEach((e, xi) => {
          const c = capParts(e.caption), bin = atob(e.src.split(",")[1]), bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const colW = Math.floor((FULL * 0.87 - 300) / 15), z = extraSize(e), f = Math.min(1, colW / z.w);
          const kids = [para(xNo(r.fr, xi), { bold: true, color: "555555", size: 18 }), new D.Paragraph({ children: [new D.ImageRun({ type: /^data:image\/png/.test(e.src) ? "png" : "jpg", data: bytes, transformation: { width: Math.round(z.w * f), height: Math.round(z.h * f) } })] })];
          if (c.head) kids.push(para(c.head, { bold: true }));
          kids.push(...wordLines(c.lines));
          if (xi) xk.push(para(" ", { size: 10 }));
          xk.push(...kids);
        });
        if (xk.length) frRows.push([cell(para(""), { vm: "continue" }), cell(xk, { span: 2, split: true, pad: { top: 100, bottom: 100, left: 150, right: 150 } })]);
      });
    });
    kids.push(table(frCols, frRows), gap());
    kids.push(table(quarters, [
      [lbl("PHASED IN REQUIREMENTS", 4)],
      ["FR NO.", "REQUIREMENT", "TARGET PHASE", "REMARKS"].map((t) => cell(para(t, { bold: true, center: true }), { fill: "ECECEC" })),
      ...[0, 1].map((r) => [0, 1, 2, 3].map((c) => edc("ph:" + r + ":" + c))),
    ]), gap());
    kids.push(table(pct(30, 70), [
      [lbl("REFERENCES", 2)],
      [cell(para("NAME", { bold: true }), { fill: "ECECEC" }), cell(para("LOCATION", { bold: true }), { fill: "ECECEC" })],
      ...REFS.map((n, i) => [cell(para(n)), edc("ref:" + i)]),
    ]));

    const doc = new D.Document({
      title: val("project") + " — Requirements Document", creator: "Annotator",
      sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } }, children: kids }],
    });
    return D.Packer.toBlob(doc);
  }

  // Keep notes in sync if another tab edits them.
  window.addEventListener("storage", (e) => { if (e.key === KEY) { notes = load(); updateToolbar(); } });

  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
