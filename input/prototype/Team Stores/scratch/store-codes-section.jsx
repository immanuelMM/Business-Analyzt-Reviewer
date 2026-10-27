function StoreCodeSection({ store, org, onUpdateStore, onToast }) {
  const isLeague = (store.storeType || "league") === "league";
  const mode = store.codeMode || "store";
  const slug = store.storeSlug || (typeof tcStoreSlug === "function" ? tcStoreSlug(store) : "store");
  const linkFor = (c) => "prolookstores.com/" + slug + "/join/" + c;
  const [copied, setCopied] = React.useState(null);
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("used");
  const [teamsOpen, setTeamsOpen] = React.useState(false);
  const [modal, setModal] = React.useState(null);
  const copy = (txt, key) => { try { navigator.clipboard && navigator.clipboard.writeText(txt); } catch (e) {} setCopied(key); setTimeout(() => setCopied(null), 1500); };
  const tiers = window.__wsTiers || [];
  const tierOf = (id) => tiers.find((t) => t.id === id);
  const managed = wsStoreCodes(store);
  const allTeams = isLeague && typeof owTeams === "function" ? owTeams(org, store).filter((t) => t.id !== "store") : [];
  const teamRows = mode === "team" ? wsTeamCodeRows(store, allTeams) : [];
  const everyCode = managed.concat(teamRows);
  const entryLive = everyCode.filter((r) => r.caps.entry && wsCodeState(r) === "live");
  const gated = !!store.requireAccessCode;
  const lockedOut = gated && entryLive.length === 0;
  const capMatch = (r) => filter === "all" || (filter === "entry" && r.caps.entry) || (filter === "tier" && r.caps.tier) || (filter === "team" && r.caps.team) || (filter === "promo" && r.caps.promo);
  const sortFn = (a, b) => sort === "used" ? (b.used || 0) - (a.used || 0) : a.code.localeCompare(b.code);
  const rows = managed.filter(capMatch).sort(sortFn);
  const teamVisible = teamRows.filter(capMatch).sort(sortFn);
  const many = everyCode.length > 1;
  const saveRecord = (rec, isNew) => {
    if (rec.caps.tier && rec.tierId && typeof wsSetCodeTier === "function") wsSetCodeTier(rec.code, rec.tierId);
    if (rec.team) {
      const ov = { ...(store.teamCodeOverrides || {}) };
      ov[rec.teamId] = { code: rec.code, label: rec.label, tierId: rec.tierId, start: rec.start, end: rec.end, limit: rec.limit, enabled: rec.enabled };
      onUpdateStore && onUpdateStore({ teamCodeOverrides: ov });
    } else {
      const next = isNew ? managed.concat([rec]) : managed.map((r) => (r.id === rec.id ? rec : r));
      const patch = { storeCodes: next };
      if (rec.id === "store") patch.storeCode = rec.code;
      onUpdateStore && onUpdateStore(patch);
    }
    onToast && onToast(isNew ? rec.code + " created" : rec.code + " saved");
    setModal(null);
  };
  const setEnabled = (rec, on) => saveRecord({ ...rec, enabled: on }, false) || (onToast && onToast(rec.code + (on ? " enabled" : " disabled")));
  const deleteRecord = (rec) => {
    if (rec.team) { const ov = { ...(store.teamCodeOverrides || {}) }; delete ov[rec.teamId]; onUpdateStore && onUpdateStore({ teamCodeOverrides: ov }); }
    else onUpdateStore && onUpdateStore({ storeCodes: managed.filter((r) => r.id !== rec.id) });
    onToast && onToast(rec.code + " deleted — past orders keep their history");
    setModal(null);
  };
  const Th = ({ children, style }) => <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".07em", color: "#9a9aa1", textTransform: "uppercase", ...style }}>{children}</span>;
  const grid = "minmax(150px,1.1fr) minmax(170px,1.3fr) minmax(130px,1fr) minmax(120px,.9fr) 56px 230px";
  const renderRow = (r, i, last) => {
    const st = wsCodeState(r);
    const muted = st === "off" || st === "expired" || st === "limit" || r.orphan;
    const tier = r.caps.tier ? tierOf(r.tierId) : null;
    return (
      <div key={r.id} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, alignItems: "center", padding: "11px 18px", borderBottom: last ? "none" : "1px solid #f1f1f3", background: "#fff" }}>
        <span style={{ minWidth: 0, opacity: muted ? .5 : 1 }}>
          <span style={{ display: "block", fontFamily: WS_MONO, fontSize: 14.5, fontWeight: 700, letterSpacing: ".08em", color: "#0e0e10", textDecoration: st === "expired" ? "line-through" : "none" }}>{r.code}</span>
          <span style={{ display: "block", fontSize: 12, color: "#6b6b72", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
        </span>
        <span style={{ display: "flex", flexWrap: "wrap", gap: 5, opacity: muted ? .5 : 1 }}>
          {r.caps.entry && <WsPill text="Grants entry" tone="dark" />}
          {r.caps.tier && <WsPill text="Sets tier" />}
          {r.caps.team && <WsPill text={r.orphan ? "Team deleted" : "Scopes to team"} tone={r.orphan ? "red" : "grey"} />}
          {r.caps.promo && <WsPill text="Promotion" tone="blue" />}
        </span>
        <span style={{ fontSize: 12.5, color: "#0e0e10", opacity: muted ? .5 : 1, minWidth: 0 }}>
          {tier ? <span><span style={{ fontWeight: 700 }}>{tier.name}</span> <span style={{ color: "#6b6b72" }}>{tier.off}%</span></span> : r.caps.promo ? <span style={{ color: "#6b6b72" }}>{wsPromoText(r.promo)} at cart</span> : <span style={{ color: "#9a9aa1" }}>—</span>}
        </span>
        <span style={{ fontSize: 12.5, color: st === "live" ? "#6b6b72" : "#0e0e10", display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
          {st === "off" ? <WsPill text="Off" /> : st === "expired" ? <WsPill text={"Expired " + wsFmtDate(r.end)} tone="grey" /> : st === "scheduled" ? <WsPill text={"Starts " + wsFmtDate(r.start)} tone="amber" /> : st === "limit" ? <WsPill text="Limit reached" tone="amber" /> : <span>{wsValidityText(r)}</span>}
          {st !== "live" && st !== "expired" && st !== "scheduled" && <span style={{ fontSize: 11.5, color: "#9a9aa1" }}>{wsValidityText(r)}</span>}
          {st === "scheduled" && r.end && <span style={{ fontSize: 11.5, color: "#9a9aa1" }}>Ends {wsFmtDate(r.end)}</span>}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0e0e10", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.used || 0}</span>
        <span style={{ display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
          <WsBtn small onClick={() => copy(r.code, "c" + r.id)} style={{ padding: "6px 10px" }}><IconClipboard size={12} style={{ strokeWidth: 2 }} /> {copied === "c" + r.id ? "Copied" : "Code"}</WsBtn>
          <WsBtn small onClick={() => copy("https://" + linkFor(r.code), "l" + r.id)} style={{ padding: "6px 10px" }}><IconLink size={12} /> {copied === "l" + r.id ? "Copied" : "Join link"}</WsBtn>
          <WsMenu items={[
            { label: "Edit", onClick: () => setModal({ rec: r }) },
            r.orphan ? null : { label: r.enabled ? "Disable" : "Enable", onClick: () => setEnabled(r, !r.enabled) },
            { label: "Delete", danger: true, onClick: () => setModal({ rec: r, del: true }) },
          ]} />
        </span>
      </div>
    );
  };
  const filters = [["all", "All", everyCode.length], ["entry", "Grants entry", everyCode.filter((r) => r.caps.entry).length], ["tier", "Sets tier", everyCode.filter((r) => r.caps.tier).length]].concat(isLeague ? [["team", "Team", everyCode.filter((r) => r.caps.team).length]] : []).concat([["promo", "Promotions", everyCode.filter((r) => r.caps.promo).length]]);
  return (
    <React.Fragment>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, fontFamily: "Archivo, sans-serif", color: "#09090b" }}>Store Codes</h3>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0, maxWidth: 640, lineHeight: 1.55 }}>The storefront is public at Retail prices. Each code does a defined job — lets shoppers in, sets their pricing tier{isLeague ? ", routes them to a team" : ""}, or applies a promotion on top.</p>
        </div>
        <WsBtn primary onClick={() => setModal({ rec: null })} style={{ flexShrink: 0 }}><IconPlus size={14} /> New code</WsBtn>
      </div>
      <div style={{ background: "#fff", border: "1px solid " + (lockedOut ? "#e1251b" : "#e4e4e7"), borderRadius: 10, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0e0e10" }}>Require a code to enter the storefront</span>
          <span style={{ display: "block", fontSize: 12, color: lockedOut ? "#b81d14" : "#6b6b72", marginTop: 2, lineHeight: 1.5, fontWeight: lockedOut ? 600 : 400 }}>
            {!gated ? "Off — anyone with the link can browse and fill a cart. An account is only needed at checkout."
              : lockedOut ? "No enabled code grants entry, so nobody can get in. Enable an entry code below or turn this off."
              : <span>{entryLive.length === 1 ? "1 code grants entry" : entryLive.length + " codes grant entry"} — {entryLive.slice(0, 3).map((r) => r.code).join(", ")}{entryLive.length > 3 ? " and " + (entryLive.length - 3) + " more" : ""}. Checkout still asks for an account. <button type="button" onClick={() => { setFilter("entry"); if (teamRows.some((r) => r.caps.entry)) setTeamsOpen(true); }} style={{ background: "transparent", border: 0, padding: 0, fontSize: 12, fontWeight: 700, color: "#0e0e10", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Show entry codes</button></span>}
          </span>
        </span>
        <SettingsToggle value={gated} onChange={(v) => { onUpdateStore && onUpdateStore({ requireAccessCode: v }); onToast && onToast(v ? "Storefront now asks for a code on entry" : "Storefront is open to anyone with the link"); }} />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10, overflow: "hidden" }}>
        {many && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", borderBottom: "1px solid #ececf0", flexWrap: "wrap" }}>
            {filters.filter((f) => f[0] === "all" || f[2] > 0).map(([id, label, n]) => (
              <button key={id} type="button" onClick={() => setFilter(id)} style={{ border: "1px solid " + (filter === id ? "#0e0e10" : "#e4e4e7"), background: filter === id ? "#0e0e10" : "#fff", color: filter === id ? "#fff" : "#3f3f46", borderRadius: 999, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", gap: 6 }}>{label}<span style={{ opacity: .6 }}>{n}</span></button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b6b72", display: "inline-flex", alignItems: "center", gap: 8 }}>Sort<WsSelect value={sort} onChange={setSort} width={130} style={{ height: 32, fontSize: 12 }} options={[{ value: "used", label: "Most used" }, { value: "code", label: "Code A–Z" }]} /></span>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "9px 18px", borderBottom: "1px solid #ececf0", background: "#fafafb" }}>
          <Th>Code · Label</Th><Th>Does</Th><Th>Tier</Th><Th>Validity</Th><Th style={{ textAlign: "right" }}>Used</Th><span />
        </div>
        {rows.length === 0 && teamVisible.length === 0 && <div style={{ padding: "28px 18px", textAlign: "center", fontSize: 13, color: "#9a9aa1" }}>No codes match this filter.</div>}
        {rows.map((r, i) => renderRow(r, i, i === rows.length - 1 && teamVisible.length === 0))}
        {teamVisible.length > 0 && (
          <div style={{ borderTop: rows.length ? "1px solid #ececf0" : "none" }}>
            <button type="button" onClick={() => setTeamsOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", background: "#fafafb", border: 0, borderBottom: teamsOpen ? "1px solid #ececf0" : "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <span style={{ display: "inline-flex", transform: teamsOpen ? "rotate(90deg)" : "none", transition: "transform .15s", color: "#6b6b72" }}><IconChevronRight size={14} /></span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0e0e10" }}>{teamVisible.length} team {teamVisible.length === 1 ? "code" : "codes"}</span>
              <span style={{ fontSize: 12, color: "#6b6b72" }}>Each grants entry, sets its team's tier and opens the store scoped to that team · {teamVisible.reduce((a, r) => a + (r.used || 0), 0)} uses</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#0e0e10" }}>{teamsOpen ? "Collapse" : "Show all"}</span>
            </button>
            {teamsOpen && teamVisible.map((r, i) => renderRow(r, i, i === teamVisible.length - 1))}
          </div>
        )}
        <div style={{ padding: "10px 18px", borderTop: "1px solid #f1f1f3", fontSize: 11.5, color: "#9a9aa1", lineHeight: 1.5, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span>Join links use <span style={{ fontFamily: WS_MONO }}>{linkFor("CODE")}</span>. Codes also work on their own at the store entry prompt and in the cart.</span>
          <button type="button" onClick={() => window.__goWorkspaceSettings && window.__goWorkspaceSettings("pricing")} style={{ marginLeft: "auto", background: "transparent", border: 0, padding: 0, fontSize: 11.5, fontWeight: 700, color: "#0e0e10", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", whiteSpace: "nowrap" }}>Manage pricing tiers</button>
        </div>
      </div>
      {isLeague && (
        <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10, padding: 20, marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0e0e10", marginBottom: 4 }}>How shoppers join this league store</div>
          <div style={{ fontSize: 12, color: "#6b6b72", marginBottom: 12, lineHeight: 1.5 }}>The store-wide code drops every shopper into the store and asks for their team; team codes route each shopper to their team directly.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["store", "One code for the whole store", "Shoppers enter " + storeCodeOf(store) + " and pick their team after signing in."], ["team", "A code per team", "Each team's code (from My Teams) opens the store already scoped to that team. " + storeCodeOf(store) + " still works store-wide."]].map(([v, t, d]) => (
              <label key={v} onClick={() => { onUpdateStore && onUpdateStore({ codeMode: v }); }} style={{ display: "flex", gap: 12, border: "1px solid " + (mode === v ? "#0e0e10" : "#e4e4e7"), borderRadius: 8, padding: "12px 14px", cursor: "pointer", background: mode === v ? "#fafafb" : "#fff" }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid " + (mode === v ? "#0e0e10" : "#c4c4c8"), background: mode === v ? "#0e0e10" : "#fff", boxShadow: mode === v ? "inset 0 0 0 3px #fff" : "none", flexShrink: 0, marginTop: 2 }} />
                <span><span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0e0e10" }}>{t}</span><span style={{ display: "block", fontSize: 12, color: "#6b6b72", marginTop: 2, lineHeight: 1.5 }}>{d}</span></span>
              </label>
            ))}
          </div>
          {mode === "team" && <div style={{ marginTop: 10, fontSize: 12, color: "#6b6b72" }}>{allTeams.length === 0 ? "No teams yet — add teams in My Teams and their codes appear in the list above." : "Team codes are generated from My Teams and listed above. Edit any of them like a store code."}</div>}
        </div>
      )}
      {modal && <StoreCodeModal store={store} rec={modal.rec} del={modal.del} isLeague={isLeague} teams={allTeams} existing={everyCode} linkFor={linkFor} slug={slug} onClose={() => setModal(null)} onSave={saveRecord} onDelete={deleteRecord} onDisable={(r) => { saveRecord({ ...r, enabled: false }, false); }} />}
    </React.Fragment>
  );
}
const WS_TODAY = new Date("2026-06-04");
function wsFmtDate(s) { if (!s) return ""; const d = new Date(s + "T00:00:00"); const o = { month: "short", day: "numeric" }; if (d.getFullYear() !== WS_TODAY.getFullYear()) o.year = "numeric"; return d.toLocaleDateString("en-US", o); }
function wsCodeState(r) {
  if (r.orphan) return "off";
  if (!r.enabled) return "off";
  if (r.end && new Date(r.end + "T23:59:59") < WS_TODAY) return "expired";
  if (r.start && new Date(r.start + "T00:00:00") > WS_TODAY) return "scheduled";
  if (r.limit && (r.used || 0) >= +r.limit) return "limit";
  return "live";
}
function wsValidityText(r) {
  const lim = r.limit ? " · " + r.limit + " uses max" : "";
  if (r.start && r.end) return wsFmtDate(r.start) + " – " + wsFmtDate(r.end) + lim;
  if (r.end) return "Ends " + wsFmtDate(r.end) + lim;
  if (r.start) return "From " + wsFmtDate(r.start) + lim;
  return "No end date" + lim;
}
function wsPromoText(p) { if (!p) return "Promotion"; if (p.type === "shipping") return "Free shipping"; if (p.type === "fixed") return "$" + (p.value || 0) + " off"; return (p.value || 0) + "% off"; }
// Codes a rep manages on this store. Stored on store.storeCodes; the store-wide
// record (id "store") always mirrors store.storeCode so older screens keep working.
function wsStoreCodes(store) {
  const base = { id: "store", code: storeCodeOf(store), label: "Store-wide", caps: { entry: true, tier: true }, tierId: typeof wsCodeTierId === "function" ? wsCodeTierId(storeCodeOf(store)) : "team", enabled: true, start: "", end: "", limit: "", used: store.seeded ? 412 : 0 };
  if (Array.isArray(store.storeCodes)) return store.storeCodes.map((r) => (r.id === "store" ? { ...base, ...r, code: storeCodeOf(store) } : r));
  if (!store.seeded) return [base];
  return [base,
    { id: "coach", code: "COACH25", label: "Coaches", caps: { entry: true, tier: true }, tierId: "coach", enabled: true, start: "", end: "", limit: "", used: 18 },
    { id: "early", code: "EARLYBIRD", label: "Early bird promo", caps: { promo: true }, promo: { type: "percent", value: 10 }, enabled: true, start: "", end: "2026-09-14", limit: "", used: 96 },
    { id: "fall", code: "FALLBALL", label: "Fall ball promo", caps: { promo: true }, promo: { type: "fixed", value: 5 }, enabled: true, start: "2026-08-01", end: "2026-08-31", limit: "200", used: 0 },
    { id: "fam", code: "FAMILY25", label: "Family day 2025", caps: { promo: true }, promo: { type: "percent", value: 15 }, enabled: false, start: "", end: "2025-10-01", limit: "", used: 61 },
  ];
}
// Team codes (league, "A code per team") — generated from My Teams, with per-team
// edits layered on top. An override whose team no longer exists stays listed as an orphan.
function wsTeamCodeRows(store, teams) {
  const ov = store.teamCodeOverrides || {};
  const rows = teams.map((t, i) => {
    const o = ov[t.id] || {};
    const code = o.code || t.code;
    return { id: "team-" + t.id, team: true, teamId: t.id, code, label: o.label || (t.name + (t.division ? " · " + t.division : "")), caps: { entry: true, tier: true, team: true }, tierId: o.tierId || (typeof wsCodeTierId === "function" ? wsCodeTierId(code) : "team"), enabled: o.enabled !== false, start: o.start || "", end: o.end || "", limit: o.limit || "", used: store.seeded ? [24, 31, 9, 17, 42, 12, 6, 28][i % 8] : 0 };
  });
  Object.keys(ov).forEach((tid) => { if (!teams.some((t) => t.id === tid)) { const o = ov[tid]; rows.push({ id: "team-" + tid, team: true, teamId: tid, orphan: true, code: o.code || "—", label: o.label || "Deleted team", caps: { entry: true, tier: true, team: true }, tierId: o.tierId || "team", enabled: false, start: o.start || "", end: o.end || "", limit: o.limit || "", used: 0 }); } });
  return rows;
}
function wsCountJoinLinks(store) {
  const n = wsStoreCodes(store).length;
  const perTeam = (store.storeType || "league") === "league" && store.codeMode === "team";
  const teams = perTeam ? ((window.__wsTeamCodeRegistry || {})[store.id] || []) : [];
  return n + teams.length;
}
function StoreCodeModal({ store, rec, del, isLeague, teams, existing, linkFor, slug, onClose, onSave, onDelete, onDisable }) {
  const isNew = !rec;
  const tiers = (window.__wsTiers || []).filter((t) => t.id !== "retail");
  const [f, setF] = React.useState(() => rec ? { ...rec, caps: { ...rec.caps }, promo: rec.promo ? { ...rec.promo } : { type: "percent", value: 10 } } : { id: "c" + Date.now().toString(36), code: "", label: "", caps: { entry: false, tier: false, team: false, promo: false }, tierId: "team", teamId: "", promo: { type: "percent", value: 10 }, enabled: true, start: "", end: "", limit: "", used: 0 });
  const [confirmDel, setConfirmDel] = React.useState(!!del);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setCap = (k, v) => setF((p) => ({ ...p, caps: { ...p.caps, [k]: v } }));
  const clean = String(f.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
  const dup = existing.some((r) => r.id !== f.id && r.code === clean);
  const tooShort = clean.length > 0 && clean.length < 4;
  const anyCap = f.caps.entry || f.caps.tier || f.caps.team || f.caps.promo;
  const teamOk = !f.caps.team || (f.team ? true : !!f.teamId);
  const promoOk = !f.caps.promo || f.promo.type === "shipping" || +f.promo.value > 0;
  const canSave = f.label.trim() && clean.length >= 4 && !dup && anyCap && teamOk && promoOk;
  const generate = () => {
    const words = f.label.toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
    let base = words.join("").slice(0, 10);
    if (base.length < 4) base = (store.teamName || store.storeTitle || "STORE").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    let c = base, n = 0; const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    while (c.length < 4 || existing.some((r) => r.id !== f.id && r.code === c)) { c = base.slice(0, 8) + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)]; if (++n > 20) break; }
    set("code", c);
  };
  const Sec = ({ n, title, children }) => (
    <div style={{ display: "flex", gap: 14 }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#f1f1f3", color: "#3f3f46", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</span>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 800, color: "#0e0e10", marginBottom: 8 }}>{title}</div>{children}</div>
    </div>
  );
  const CapRow = ({ k, title, desc, children }) => (
    <div style={{ border: "1px solid " + (f.caps[k] ? "#0e0e10" : "#e4e4e7"), borderRadius: 8, padding: "11px 14px", background: f.caps[k] ? "#fafafb" : "#fff" }}>
      <Checkbox checked={!!f.caps[k]} onChange={(v) => setCap(k, v)} label={<span><span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0e0e10" }}>{title}</span><span style={{ display: "block", fontSize: 12, color: "#6b6b72", marginTop: 2, lineHeight: 1.5 }}>{desc}</span></span>} />
      {f.caps[k] && children && <div style={{ marginTop: 10, paddingLeft: 28 }}>{children}</div>}
    </div>
  );
  const segBtn = (on) => ({ border: "1px solid " + (on ? "#0e0e10" : "#d4d4d8"), background: on ? "#0e0e10" : "#fff", color: on ? "#fff" : "#0e0e10", borderRadius: 6, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });
  return (
    <Modal open onClose={onClose} width={620}>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "86vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderBottom: "1px solid #ececf0", flexShrink: 0 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: ".04em", margin: 0 }}>{isNew ? "NEW STORE CODE" : "EDIT STORE CODE"}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: 0, cursor: "pointer", padding: 8, color: "#0e0e10", display: "inline-flex" }}><IconX size={20} style={{ strokeWidth: 2 }} /></button>
        </div>
        {confirmDel ? (
          <div style={{ padding: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0e0e10", marginBottom: 8 }}>Delete <span style={{ fontFamily: WS_MONO, letterSpacing: ".06em" }}>{f.code}</span>?</div>
            <div style={{ fontSize: 13, color: "#3f3f46", lineHeight: 1.6 }}>
              {(f.used || 0) > 0 ? <span><b>{f.used} orders</b> were placed with this code. They keep their code, pricing and history — the code just stops working and leaves this list, so it disappears from this season's numbers. <b>Disabling</b> stops it working too, but keeps it here with its usage.</span> : "No orders have used this code yet. It stops working and leaves this list."}
              {f.id === "store" && <span style={{ display: "block", marginTop: 8, color: "#b81d14", fontWeight: 600 }}>This is the store-wide code — the store needs one to route shoppers. Change it instead of deleting it.</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <WsBtn onClick={() => (del ? onClose() : setConfirmDel(false))}>Cancel</WsBtn>
              {(f.used || 0) > 0 && f.enabled && <WsBtn onClick={() => onDisable(rec)}>Disable instead</WsBtn>}
              <WsBtn danger disabled={f.id === "store"} onClick={() => onDelete(rec)} style={{ borderColor: "#e1251b", background: "#e1251b", color: "#fff" }}>Delete code</WsBtn>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ padding: 28, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
              <Sec n="1" title="Label">
                <input autoFocus value={f.label} onChange={(e) => set("label", e.target.value)} placeholder='What you call it — "Early bird", "Coaches", "Lone Peak 10U"' style={WS_INPUT} />
              </Sec>
              <Sec n="2" title="Code">
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={f.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="SHORT AND SAYABLE" style={{ ...WS_INPUT, fontFamily: WS_MONO, fontWeight: 700, letterSpacing: ".08em", fontSize: 15, border: "1px solid " + (dup || tooShort ? "#e1251b" : "#d4d4d8") }} />
                  <WsBtn onClick={generate} style={{ height: 40 }}>Generate</WsBtn>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, minHeight: 16, fontWeight: 600, color: dup || tooShort ? "#b81d14" : "#6b6b72" }}>
                  {tooShort ? "At least 4 letters or numbers" : dup ? clean + " is already a code on this store" : "Letters and numbers only · unique within this store"}
                </div>
                <div style={{ marginTop: 8, padding: "9px 12px", background: "#fafafb", border: "1px solid #ececf0", borderRadius: 6, fontFamily: WS_MONO, fontSize: 12.5, display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                  <span style={{ color: "#a1a1aa" }}>prolookstores.com/{slug}/join/</span><span style={{ color: "#0e0e10", fontWeight: 700, letterSpacing: ".06em" }}>{clean || "CODE"}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "inherit", fontSize: 11.5, color: "#9a9aa1" }}>Join link</span>
                </div>
              </Sec>
              <Sec n="3" title="What it does">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <CapRow k="entry" title="Grants entry" desc={store.requireAccessCode ? "Opens the storefront — it's gated right now." : "Opens the storefront when it's gated. The store isn't gated right now, so this does nothing yet."} />
                  <CapRow k="tier" title="Sets a pricing tier" desc="Shoppers see that tier's prices for the whole visit.">
                    <WsSelect value={f.tierId} onChange={(v) => set("tierId", v)} width="100%" options={tiers.map((t) => ({ value: t.id, label: t.name + " · " + t.off + "% off retail" }))} />
                  </CapRow>
                  {isLeague && (
                    <CapRow k="team" title="Scopes to a team" desc="Opens the store already scoped to that team.">
                      {f.team ? <div style={{ fontSize: 12.5, color: "#0e0e10" }}>{teams.find((t) => t.id === f.teamId)?.name || <span style={{ color: "#b81d14", fontWeight: 600 }}>This team was deleted — the code can't scope to it. Delete the code or pick another team.</span>}</div>
                        : teams.length === 0 ? <div style={{ fontSize: 12.5, color: "#b81d14", fontWeight: 600 }}>No teams yet — add them in My Teams first.</div>
                        : <WsSelect value={f.teamId} onChange={(v) => set("teamId", v)} width="100%" options={[{ value: "", label: "Choose a team…" }].concat(teams.map((t) => ({ value: t.id, label: t.name + (t.division ? " · " + t.division : "") })))} />}
                    </CapRow>
                  )}
                  <CapRow k="promo" title="Applies a promotion" desc="A discount on top of whatever tier the shopper is on. Entered in the cart.">
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {[["percent", "Percent off"], ["fixed", "Fixed $ off"], ["shipping", "Free shipping"]].map(([v, l]) => <button key={v} type="button" onClick={() => set("promo", { ...f.promo, type: v })} style={segBtn(f.promo.type === v)}>{l}</button>)}
                      {f.promo.type !== "shipping" && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                        {f.promo.type === "fixed" && <span style={{ fontSize: 13, color: "#6b6b72" }}>$</span>}
                        <input type="number" min="1" value={f.promo.value} onChange={(e) => set("promo", { ...f.promo, value: e.target.value })} style={{ ...WS_INPUT, width: 84, height: 34 }} />
                        {f.promo.type === "percent" && <span style={{ fontSize: 13, color: "#6b6b72" }}>%</span>}
                      </span>}
                    </div>
                  </CapRow>
                </div>
                {!anyCap && <div style={{ marginTop: 8, fontSize: 12, color: "#b81d14", fontWeight: 600 }}>Pick at least one.</div>}
              </Sec>
              <Sec n="4" title="Validity">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <WsField label="Starts"><input type="date" value={f.start} onChange={(e) => set("start", e.target.value)} style={WS_INPUT} /></WsField>
                  <WsField label="Ends"><input type="date" value={f.end} onChange={(e) => set("end", e.target.value)} style={WS_INPUT} /></WsField>
                  <WsField label="Redemption limit"><input type="number" min="1" placeholder="No limit" value={f.limit} onChange={(e) => set("limit", e.target.value)} style={WS_INPUT} /></WsField>
                </div>
                <div style={{ marginTop: 6, fontSize: 11.5, color: "#9a9aa1" }}>All optional. Leave blank for a code that never expires.</div>
              </Sec>
              <Sec n="5" title="Status">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <SettingsToggle value={!!f.enabled} onChange={(v) => set("enabled", v)} />
                  <span style={{ fontSize: 12.5, color: "#3f3f46" }}>{f.enabled ? "On — works as soon as you save" : "Off — listed, but shoppers can't use it"}{!isNew && (f.used || 0) > 0 ? " · " + f.used + " uses so far" : ""}</span>
                </div>
              </Sec>
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #ececf0", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, background: "#fff" }}>
              {!isNew && <button type="button" onClick={() => setConfirmDel(true)} style={{ background: "transparent", border: 0, padding: 0, fontSize: 13, fontWeight: 700, color: "#b81d14", cursor: "pointer", fontFamily: "inherit" }}>Delete code</button>}
              <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <WsBtn onClick={onClose}>Cancel</WsBtn>
                <WsBtn primary disabled={!canSave} onClick={() => onSave({ ...f, code: clean, label: f.label.trim(), promo: f.caps.promo ? f.promo : undefined, tierId: f.caps.tier ? f.tierId : undefined }, isNew)}>{isNew ? "Create code" : "Save changes"}</WsBtn>
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    </Modal>
  );
}
