

/* ===== REPORTING — Phases 1–3: monthly commission, sales breakdown, still need to order ===== */
// Commission basis: tier spread — the gap between the tier a shopper paid and the
// tier directly below it (Workspace Settings → Pricing Tiers). Split between the
// Organization and the rep per rep (Workspace Settings → User Management).
const RPT = { ink: "#0e0e10", muted: "#6b6b72", faint: "#9a9aa1", line: "#e4e4e7", soft: "#f4f4f5", green: "#1f7a44", greenBg: "#e7f5ed", red: "#b81d14", redBg: "#fdecea", amber: "#8a6408", amberBg: "#fdf3d3" };
const RPT_MONO = "'JetBrains Mono', ui-monospace, monospace";
const RPT_NUM = { fontVariantNumeric: "tabular-nums lining-nums" };
function rptMoney(n) { const s = "$" + Math.round(Math.abs(n)).toLocaleString("en-US"); return n < 0 ? "(" + s + ")" : s; }
function rptMoney2(n) { const s = "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return n < 0 ? "(" + s + ")" : s; }
function rptPct(n) { return (Math.round(n * 10) / 10).toFixed(1) + "%"; }
function rptSeed(str) { let h = 2166136261; const s = String(str); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rptRng(seed) { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
function rptTiers() {
  return (window.__wsTiers && window.__wsTiers.length ? window.__wsTiers : [
    { id: "retail", name: "Retail", off: 0 }, { id: "booster", name: "Booster / Sponsor", off: 10 }, { id: "team", name: "Team / Player", off: 18 }, { id: "coach", name: "Coach & Staff", off: 28 }, { id: "base", name: "Base", off: 40 }]);
}
function rptTierPrice(t, msrp) { return Math.round(msrp * (1 - (t.off || 0) / 100) * 100) / 100; }
// Months, newest first, including the current (in-progress) one.
function rptMonths(n = 13) {
  const now = new Date(); const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"), label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }), short: d.toLocaleDateString("en-US", { month: "short" }), year: d.getFullYear(), month: d.getMonth(), current: i === 0 });
  }
  return out;
}
function rptDefaultMonth() { return rptMonths(2)[1].key; }
function rptMonthLabel(key) { const m = rptMonths(24).find((x) => x.key === key); return m ? m.label : key; }
function rptPrevMonth(key) { const ms = rptMonths(24); const i = ms.findIndex((x) => x.key === key); return ms[i + 1] ? ms[i + 1].key : null; }

// ── Reps & split ──
window.__wsRepSplit = window.__wsRepSplit || {};
function rptRepShare(name) { const v = window.__wsRepSplit[name]; return typeof v === "number" ? v : 60; }
function rptReps(stores) {
  const seen = new Map();
  (stores || []).forEach((s) => { const n = s.createdBy || "Unassigned"; if (!seen.has(n)) seen.set(n, { name: n, stores: [] }); seen.get(n).stores.push(s); });
  return Array.from(seen.values());
}
function rptViewer(stores) {
  const mine = (stores || []).filter((s) => s.ownership === "mine" && s.createdBy);
  const c = {}; mine.forEach((s) => { c[s.createdBy] = (c[s.createdBy] || 0) + 1; });
  return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || "Hingle McCringleberry";
}

// ── Order lines (deterministic per store × month) ──
const RPT_BUYERS = ["Susan Quinones", "Marcus Whitfield", "Dana Herwitz", "Priya Natarajan", "Tom Calzoni", "Renee Stanton", "Felix Aminoff", "Gloria Curtis", "Hank Passaquindici", "Mei Okafor", "Luis Ortega", "Bea Lindqvist", "Omar Haddad", "Jess Tran", "Carla Mendes", "Devin Brooks"];
const RPT_CATALOG = [
  { title: "Home Game Jersey", category: "Uniforms", brand: "Prolook", deco: "Sublimated", msrp: 65, team: "team-required" },
  { title: "Home Game Shorts", category: "Uniforms", brand: "Prolook", deco: "Sublimated", msrp: 58, team: "team-required" },
  { title: "Away Game Jersey", category: "Uniforms", brand: "Prolook", deco: "Sublimated", msrp: 65, team: "team-required" },
  { title: "Team Warm-Up Hoodie", category: "Outerwear", brand: "Prolook", deco: "Decorated", msrp: 72, team: "team-supplied" },
  { title: "Scuba Hoodie", category: "Hoodies", brand: "Prolook", deco: "Stock", msrp: 92, team: null },
  { title: "Raglan Short Sleeve", category: "Tees", brand: "Prolook", deco: "Stock", msrp: 32, team: null },
  { title: "Fan Spirit Tee", category: "Fan Gear", brand: "Prolook", deco: "Decorated", msrp: 34, team: null },
  { title: "Sideline Polo", category: "Polos", brand: "Prolook", deco: "Stock", msrp: 74, team: null },
  { title: "Squad Bag", category: "Bags", brand: "Prolook", deco: "Sublimated", msrp: 99, team: null },
  { title: "1/4-Zip Sideline Pullover", category: "Outerwear", brand: "Prolook", deco: "Stock", msrp: 82, team: null },
  { title: "Team Cap", category: "Headwear", brand: "Richardson", deco: "Decorated", msrp: 28, team: null },
  { title: "Game Socks", category: "Accessories", brand: "TCK", deco: "Stock", msrp: 14, team: null },
];
const RPT_MONTH_WEIGHT = [0.6, 0.8, 1.1, 0.7, 0.9, 1.2, 1.35, 1.5, 1.0, 1.15, 1.3, 1.05];
const RPT_REFUND_REASONS = ["Wrong size ordered", "Duplicate order", "Player left the team", "Damaged in transit", "Changed mind before production"];
function rptStoreCatalog(store) {
  const own = (store && store.products || []).filter((p) => p.title && !p.hidden && p.status !== "draft").map((p) => ({
    title: p.title, category: p.category || p.storeCategory || (p.teamSetting === "team-required" || p.teamSetting === "team-supplied" ? "Team Gear" : "Fan Gear"), brand: p.brand || "Prolook",
    deco: p.srcKind === "vault" || p.source === "ProStock" ? "Stock" : (p.deco === "render" || /decorated/i.test(p.source || "") ? "Decorated" : "Sublimated"),
    msrp: parseFloat(p.retail || (p.pricing && p.pricing.adult && p.pricing.adult.retail) || p.priceAdult) || 60, team: p.teamSetting === "team-required" || p.teamSetting === "team-supplied" ? p.teamSetting : null }));
  return own.length >= 4 ? own : RPT_CATALOG;
}
function rptStoreLines(store, monthKey) {
  if (!store || store.status === "draft" || store.__fresh) return [];
  const m = rptMonths(24).find((x) => x.key === monthKey); if (!m) return [];
  const idx = ((m.month + 12 * m.year) % 12);
  const rng = rptRng(rptSeed(store.id + "|" + monthKey));
  const rev = store.revenue || 3800;
  const count = Math.max(2, Math.round((rev / 60) * RPT_MONTH_WEIGHT[idx] / 12 * (m.current ? 0.3 : 1)));
  const tiers = rptTiers(); const cat = rptStoreCatalog(store); const fundOn = store.fundraisingEnabled === true;
  const rep = store.createdBy || "Unassigned";
  const days = m.current ? Math.max(1, new Date().getDate() - 1) : new Date(m.year, m.month + 1, 0).getDate();
  const out = [];
  for (let i = 0; i < count; i++) {
    const p = cat[Math.floor(rng() * cat.length)];
    const buyer = RPT_BUYERS[Math.floor(rng() * RPT_BUYERS.length)];
    const r = rng(); const tierId = r < 0.35 ? "retail" : r < 0.8 ? "team" : r < 0.9 ? "booster" : "coach";
    const ti = Math.max(0, tiers.findIndex((t) => t.id === tierId)); const tier = tiers[ti] || tiers[0]; const below = tiers[ti + 1] || null;
    const units = 1 + (rng() < 0.3 ? 1 : 0) + (rng() < 0.1 ? 1 : 0);
    const paid = rptTierPrice(tier, p.msrp); const spread = below ? Math.max(0, paid - rptTierPrice(below, p.msrp)) : 0;
    const fund = fundOn && rng() < 0.45 ? [3, 5, 8][Math.floor(rng() * 3)] * units : 0;
    const rr = rng(); const refund = rr < 0.04 ? "full" : rr < 0.07 ? "partial" : null;
    const day = 1 + Math.floor(rng() * days);
    const date = new Date(m.year, m.month, day);
    const refundFrac = refund === "full" ? 1 : refund === "partial" ? 0.5 : 0;
    out.push({ id: "W" + (rptSeed(store.id + monthKey + i) % 900000 + 100000), storeId: store.id, store, storeName: store.storeTitle || store.teamName || "Store", rep, buyer, product: p.title, category: p.category, brand: p.brand, deco: p.deco, team: p.team,
      units, msrp: p.msrp, tier: tier.name, tierId: tier.id, belowName: below ? below.name : null, paid, gross: Math.round(paid * units * 100) / 100, fund, commission: Math.round(spread * units * 100) / 100,
      refund, refundAmount: Math.round(paid * units * refundFrac * 100) / 100, reversal: Math.round(spread * units * refundFrac * 100) / 100, reason: refund ? RPT_REFUND_REASONS[Math.floor(rng() * RPT_REFUND_REASONS.length)] : null,
      date, dateLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  }
  return out.sort((a, b) => a.date - b.date);
}
function rptLines(stores, monthKey) { return (stores || []).flatMap((s) => rptStoreLines(s, monthKey)); }
function rptSum(lines) {
  const s = { gross: 0, fund: 0, grossComm: 0, reversals: 0, units: 0 };
  lines.forEach((l) => { s.gross += l.gross; s.fund += l.fund; s.grossComm += l.commission; s.reversals += l.reversal; s.units += l.units; });
  s.net = s.grossComm - s.reversals; return s;
}
function rptCsv(filename, rows) {
  const esc = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
}

// ── Small shared pieces ──
function RptToastHost({ text }) { if (!text) return null; return <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#0e0e10", color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 12.5, boxShadow: "0 12px 32px rgba(9,9,11,.25)", zIndex: 700 }}>{text}</div>; }
function useRptToast() { const [t, setT] = React.useState(null); React.useEffect(() => { if (!t) return; const h = setTimeout(() => setT(null), 2800); return () => clearTimeout(h); }, [t]); return [t, setT]; }
function RptTh({ children, right, style }) { return <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".07em", color: RPT.faint, textTransform: "uppercase", textAlign: right ? "right" : "left", ...style }}>{children}</span>; }
function RptPill({ text, tone = "grey" }) { const m = { grey: [RPT.soft, "#3f3f46"], green: [RPT.greenBg, RPT.green], red: [RPT.redBg, RPT.red], amber: [RPT.amberBg, RPT.amber], dark: ["#0e0e10", "#fff"] }; const [bg, fg] = m[tone] || m.grey; return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, color: fg, background: bg, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>{text}</span>; }
function RptBtn({ children, onClick, primary, small, disabled, style, title }) {
  return <button type="button" title={title} disabled={disabled} onClick={onClick} style={{ background: primary ? "#0e0e10" : "#fff", color: primary ? "#fff" : "#0e0e10", border: "1px solid " + (primary ? "#0e0e10" : "#d4d4d8"), borderRadius: 6, padding: small ? "7px 12px" : "10px 16px", fontSize: small ? 12 : 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: disabled ? .5 : 1, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", ...style }}>{children}</button>;
}
function RptSelect({ value, onChange, options, width = 200, style }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} style={{ height: 38, width, boxSizing: "border-box", border: "1px solid #d4d4d8", borderRadius: 6, padding: "0 10px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", color: RPT.ink, ...style }}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}
function RptCard({ children, style, dark }) { return <div style={{ background: dark ? "#0e0e10" : "#fff", color: dark ? "#fff" : RPT.ink, border: dark ? 0 : "1px solid " + RPT.line, borderRadius: 12, padding: "20px 24px", ...style }}>{children}</div>; }
function RptMonthPicker({ value, onChange, label = "Month" }) {
  const ms = rptMonths(13);
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: RPT.muted }}>{label}</span>
      <RptSelect value={value} onChange={onChange} width={230} options={ms.map((m) => ({ value: m.key, label: m.label + (m.current ? " · in progress" : "") }))} />
    </label>
  );
}
// Compact 12-month commission trend. Supports the hero number; never competes with it.
function RptTrend({ stores, month, onPick, height = 72 }) {
  const ms = rptMonths(13).slice(1 - 0, 13); // completed months only, oldest → newest
  const series = React.useMemo(() => rptMonths(13).slice(1).reverse().map((m) => ({ ...m, v: rptSum(rptLines(stores, m.key)).net })), [stores]);
  const cur = rptMonths(1)[0]; const curV = rptSum(rptLines(stores, cur.key)).net;
  const all = [...series, { ...cur, v: curV }];
  const max = Math.max(...all.map((d) => d.v), 1);
  const [hover, setHover] = React.useState(null);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
        {all.map((d) => { const on = d.key === month; const h = Math.max(3, Math.round((d.v / max) * (height - 18))); return (
          <button key={d.key} type="button" onClick={() => onPick && onPick(d.key)} onMouseEnter={() => setHover(d.key)} onMouseLeave={() => setHover(null)} title={d.label + " · " + rptMoney(d.v)} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4, background: "transparent", border: 0, padding: 0, cursor: "pointer", height: "100%" }}>
            {(hover === d.key || on) && <span style={{ fontSize: 10, fontWeight: 700, color: RPT.ink, ...RPT_NUM, whiteSpace: "nowrap" }}>{rptMoney(d.v)}</span>}
            <span style={{ width: "100%", height: h, borderRadius: 3, background: on ? "#0e0e10" : d.current ? "transparent" : "#d4d4d8", border: d.current && !on ? "1.5px dashed #a1a1aa" : 0, boxSizing: "border-box" }} />
          </button>); })}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>{all.map((d) => <span key={d.key} style={{ flex: 1, textAlign: "center", fontSize: 10, color: d.key === month ? RPT.ink : RPT.faint, fontWeight: d.key === month ? 700 : 500 }}>{d.short}</span>)}</div>
    </div>
  );
}
// Order detail for a reversal row — the order that caused it, in place.
function RptOrderModal({ line, onClose }) {
  if (!line) return null;
  const rows = [["Order", line.id], ["Store", line.storeName], ["Buyer", line.buyer], ["Date", line.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })], ["Item", line.product + " × " + line.units], ["Tier paid", line.tier + (line.belowName ? " · spread to " + line.belowName : "")], ["Original amount", rptMoney2(line.gross)], ["Refunded", (line.refund === "partial" ? "Partial · " : "Full · ") + rptMoney2(line.refundAmount)], ["Reason", line.reason || "Not captured"], ["Commission reversal", rptMoney2(-line.reversal)]];
  return (
    <Modal open={!!line} onClose={onClose} width={500}>
      <div style={{ padding: "28px 28px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: "Archivo, sans-serif" }}>Order {line.id}</h2><RptPill text={line.refund === "partial" ? "Partially refunded" : "Refunded"} tone={line.refund === "partial" ? "amber" : "red"} /></div>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: RPT.muted, lineHeight: 1.55 }}>Refunds arrive from the ERP. The reversal below is what this refund took out of the month's commission.</p>
        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: 8, fontSize: 13 }}>{rows.map(([k, v]) => <React.Fragment key={k}><span style={{ color: RPT.faint }}>{k}</span><span style={{ color: RPT.ink, fontWeight: k === "Commission reversal" ? 800 : 500, ...RPT_NUM }}>{v}</span></React.Fragment>)}</div>
      </div>
      <div style={{ padding: "20px 28px", display: "flex", justifyContent: "flex-end" }}><Button variant="primary" onClick={onClose}>Done</Button></div>
    </Modal>
  );
}

// ══════════ Phase 1 · Monthly commission report ══════════
function CommissionReport({ stores, month, setMonth, viewer, scopeLabel, onToast }) {
  const lines = React.useMemo(() => rptLines(stores, month), [stores, month]);
  const prevKey = rptPrevMonth(month);
  const prev = React.useMemo(() => prevKey ? rptSum(rptLines(stores, prevKey)) : null, [stores, prevKey]);
  const s = rptSum(lines);
  const m = rptMonths(24).find((x) => x.key === month) || {};
  const delta = prev && prev.grossComm > 0 ? ((s.grossComm - prev.grossComm) / prev.grossComm) * 100 : null;
  const reversals = lines.filter((l) => l.refund);
  const [openLine, setOpenLine] = React.useState(null);
  const [sort, setSort] = React.useState({ key: "total", dir: -1 });
  // One row per rep: how that rep's sales divide between the Organization and the rep.
  const repRows = React.useMemo(() => {
    const by = {};
    lines.forEach((l) => { const r = by[l.rep] || (by[l.rep] = { rep: l.rep, gross: 0, fund: 0, total: 0 }); r.gross += l.gross; r.fund += l.fund; r.total += l.commission - l.reversal; });
    return Object.values(by).map((r) => { const share = rptRepShare(r.rep) / 100; return { ...r, repShare: r.total * share, orgShare: r.total * (1 - share), pct: rptRepShare(r.rep) }; });
  }, [lines]);
  const sorted = repRows.slice().sort((a, b) => { const k = sort.key; const av = k === "rep" ? a.rep : a[k]; const bv = k === "rep" ? b.rep : b[k]; return (av > bv ? 1 : av < bv ? -1 : 0) * sort.dir; });
  const totals = repRows.reduce((t, r) => ({ gross: t.gross + r.gross, fund: t.fund + r.fund, orgShare: t.orgShare + r.orgShare, repShare: t.repShare + r.repShare, total: t.total + r.total }), { gross: 0, fund: 0, orgShare: 0, repShare: 0, total: 0 });
  const mine = repRows.find((r) => r.rep === viewer);
  const th = (key, label, right) => <button type="button" onClick={() => setSort((x) => ({ key, dir: x.key === key ? -x.dir : -1 }))} style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, justifyContent: right ? "flex-end" : "flex-start", width: "100%" }}><RptTh>{label}</RptTh>{sort.key === key && <span style={{ fontSize: 9, color: RPT.ink }}>{sort.dir < 0 ? "▼" : "▲"}</span>}</button>;
  const exportCsv = () => {
    const rows = [["Rep", "Gross sales", "Fundraising", "Organization share", "Rep share", "Total commission"], ...sorted.map((r) => [r.rep, r.gross.toFixed(2), r.fund.toFixed(2), r.orgShare.toFixed(2), r.repShare.toFixed(2), r.total.toFixed(2)]), ["Total", totals.gross.toFixed(2), totals.fund.toFixed(2), totals.orgShare.toFixed(2), totals.repShare.toFixed(2), totals.total.toFixed(2)], [], ["Gross commission", s.grossComm.toFixed(2)], ["Refund reversals", (-s.reversals).toFixed(2)], ["Net commission payable", s.net.toFixed(2)]];
    rptCsv("commission-" + month + ".csv", rows); onToast && onToast("CSV for " + m.label + " downloaded");
  };
  const colGrid = "minmax(160px,1.4fr) repeat(5, minmax(110px,1fr))";
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Answer first */}
      <RptCard>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.3fr) minmax(300px, 1fr)", gap: 28, alignItems: "stretch" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".07em", color: RPT.muted, textTransform: "uppercase" }}>Commission earned</span>
              <span style={{ fontSize: 12.5, color: RPT.faint }}>{m.label}{m.current ? " · in progress" : ""}{scopeLabel ? " · " + scopeLabel : ""}</span>
            </div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 52, fontWeight: 800, color: RPT.ink, lineHeight: 1.05, letterSpacing: "-.02em", marginTop: 10, ...RPT_NUM }}>{rptMoney(s.grossComm)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
              {delta != null ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: delta >= 0 ? RPT.green : RPT.red }}>{delta >= 0 ? "▲" : "▼"} {rptPct(Math.abs(delta))}</span> : <span style={{ color: RPT.faint }}>No prior month to compare</span>}
              {delta != null && <span style={{ color: RPT.muted }}>{delta >= 0 ? "up" : "down"} from {rptMonthLabel(prevKey)} ({rptMoney(prev.grossComm)})</span>}
            </div>
            {mine && repRows.length > 1 && <div style={{ marginTop: 14, fontSize: 12.5, color: RPT.muted }}>Your share this month <strong style={{ color: RPT.ink, ...RPT_NUM }}>{rptMoney(mine.repShare)}</strong> · Organization <strong style={{ color: RPT.ink, ...RPT_NUM }}>{rptMoney(mine.orgShare)}</strong> on your sales</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 22 }}>
              {[["Gross sales", s.gross], ["Fundraising raised", s.fund], ["Net commission payable", s.net, "after reversals"]].map(([l, v, sub]) => (
                <div key={l} style={{ borderTop: "1px solid " + RPT.line, paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: RPT.faint, textTransform: "uppercase" }}>{l}</div>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 22, fontWeight: 800, color: RPT.ink, marginTop: 4, ...RPT_NUM }}>{rptMoney(v)}</div>
                  {sub && <div style={{ fontSize: 11.5, color: RPT.faint }}>{sub}</div>}
                </div>))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: RPT.faint, textTransform: "uppercase", marginBottom: 10 }}>Net commission · last 12 months</div>
            <RptTrend stores={stores} month={month} onPick={setMonth} />
          </div>
        </div>
      </RptCard>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(0, 1.6fr)", gap: 16, alignItems: "start" }}>
        {/* Reconciliation */}
        <RptCard>
          <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>How gross becomes payable</div>
          <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 2, marginBottom: 14 }}>{m.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 10, fontSize: 13.5 }}>
            <span style={{ color: RPT.ink }}>Gross commission</span><span style={{ fontWeight: 700, ...RPT_NUM }}>{rptMoney2(s.grossComm)}</span>
            <span style={{ color: RPT.ink }}>Refund reversals <span style={{ color: RPT.faint }}>({reversals.length})</span></span><span style={{ fontWeight: 700, ...RPT_NUM }}>− {rptMoney2(s.reversals)}</span>
            <span style={{ gridColumn: "1 / -1", borderTop: "1px solid " + RPT.ink, marginTop: 2 }} />
            <span style={{ fontWeight: 800 }}>Net commission payable</span><span style={{ fontWeight: 800, ...RPT_NUM }}>{rptMoney2(s.net)}</span>
          </div>
          <div style={{ marginTop: 18, borderTop: "1px solid " + RPT.line, paddingTop: 14 }}>
            <RptTh>Reversals · each links to its order</RptTh>
            {reversals.length === 0 ? <div style={{ fontSize: 12.5, color: RPT.faint, marginTop: 8 }}>No refunds reversed this month.</div> : (
              <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                {reversals.map((l) => (
                  <button key={l.id} type="button" onClick={() => setOpenLine(l)} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "center", background: "transparent", border: 0, padding: "6px 0", cursor: "pointer", fontFamily: "inherit", textAlign: "left", borderBottom: "1px solid #f4f4f5" }}>
                    <span style={{ fontFamily: RPT_MONO, fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{l.id}</span>
                    <span style={{ fontSize: 12, color: RPT.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.buyer} · {l.product}{l.refund === "partial" ? " · partial" : ""}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: RPT.ink, ...RPT_NUM }}>({rptMoney2(l.reversal)})</span>
                  </button>))}
              </div>)}
          </div>
        </RptCard>

        {/* Organization vs rep split */}
        <RptCard style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 24px 12px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>Organization vs. rep split</div>
              <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 2 }}>How each rep's net commission divides. Split rates are set in Workspace Settings → User Management.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <RptBtn small onClick={exportCsv}><IconDownload size={13} /> CSV · {m.short} {m.year}</RptBtn>
              <RptBtn small onClick={() => onToast && onToast("PDF for " + m.label + " is on its way")}><IconDownload size={13} /> PDF · {m.short} {m.year}</RptBtn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: colGrid, gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb" }}>
            {th("rep", "Rep")}{th("gross", "Gross sales", true)}{th("fund", "Fundraising", true)}{th("orgShare", "Organization share", true)}{th("repShare", "Rep share", true)}{th("total", "Total commission", true)}
          </div>
          {sorted.length === 0 && <div style={{ padding: "28px 24px", fontSize: 13, color: RPT.faint, textAlign: "center" }}>No sales in {m.label}.</div>}
          {sorted.map((r, i) => (
            <div key={r.rep} style={{ display: "grid", gridTemplateColumns: colGrid, gap: 12, padding: "12px 24px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 13, ...RPT_NUM }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}><span style={{ fontWeight: 700, color: RPT.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.rep}</span>{r.rep === viewer && <RptPill text="You" tone="dark" />}<span style={{ fontSize: 11, color: RPT.faint, whiteSpace: "nowrap" }}>{100 - r.pct}/{r.pct}</span></span>
              <span style={{ textAlign: "right" }}>{rptMoney2(r.gross)}</span><span style={{ textAlign: "right" }}>{rptMoney2(r.fund)}</span><span style={{ textAlign: "right" }}>{rptMoney2(r.orgShare)}</span><span style={{ textAlign: "right" }}>{rptMoney2(r.repShare)}</span><span style={{ textAlign: "right", fontWeight: 700 }}>{rptMoney2(r.total)}</span>
            </div>))}
          {sorted.length > 0 && <div style={{ display: "grid", gridTemplateColumns: colGrid, gap: 12, padding: "12px 24px", alignItems: "center", fontSize: 13, fontWeight: 800, background: "#fafafb", ...RPT_NUM }}>
            <span>Total · reconciles to net payable</span><span style={{ textAlign: "right" }}>{rptMoney2(totals.gross)}</span><span style={{ textAlign: "right" }}>{rptMoney2(totals.fund)}</span><span style={{ textAlign: "right" }}>{rptMoney2(totals.orgShare)}</span><span style={{ textAlign: "right" }}>{rptMoney2(totals.repShare)}</span><span style={{ textAlign: "right" }}>{rptMoney2(totals.total)}</span>
          </div>}
        </RptCard>
      </div>
      <RptOrderModal line={openLine} onClose={() => setOpenLine(null)} />
    </div>
  );
}

// ══════════ Phase 2 · Sales breakdown — one table, group-by selector ══════════
const RPT_GROUPS = [["category", "Category"], ["product", "Product"], ["buyer", "Buyer"], ["deco", "Decoration type"], ["brand", "Brand"]];
function SalesBreakdown({ stores, month, onToast }) {
  const lines = React.useMemo(() => rptLines(stores, month), [stores, month]);
  const [group, setGroup] = React.useState("category");
  const [sort, setSort] = React.useState({ key: "gross", dir: -1 });
  const [open, setOpen] = React.useState({});
  const m = rptMonths(24).find((x) => x.key === month) || {};
  const childKey = group === "buyer" ? "product" : group === "product" ? "buyer" : "product";
  const roll = (arr, key) => { const by = {}; arr.forEach((l) => { const r = by[l[key]] || (by[l[key]] = { name: l[key], units: 0, gross: 0, fund: 0, comm: 0, lines: [] }); r.units += l.units; r.gross += l.gross - l.refundAmount; r.fund += l.fund; r.comm += l.commission - l.reversal; r.lines.push(l); }); return Object.values(by); };
  const rows = React.useMemo(() => roll(lines, group), [lines, group]);
  const total = rows.reduce((t, r) => t + r.gross, 0) || 1;
  const sorter = (a, b) => { const av = sort.key === "name" ? a.name : a[sort.key]; const bv = sort.key === "name" ? b.name : b[sort.key]; return (av > bv ? 1 : av < bv ? -1 : 0) * sort.dir; };
  const sorted = rows.slice().sort(sorter);
  const grid = "24px minmax(180px,1.6fr) 80px repeat(3, minmax(100px,1fr)) minmax(140px,1.2fr)";
  const th = (key, label, right) => <button type="button" onClick={() => setSort((x) => ({ key, dir: x.key === key ? -x.dir : -1 }))} style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, justifyContent: right ? "flex-end" : "flex-start", width: "100%" }}><RptTh>{label}</RptTh>{sort.key === key && <span style={{ fontSize: 9, color: RPT.ink }}>{sort.dir < 0 ? "▼" : "▲"}</span>}</button>;
  const share = (v) => { const p = (v / total) * 100; return <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ flex: 1, height: 6, borderRadius: 3, background: RPT.soft, overflow: "hidden" }}><span style={{ display: "block", width: Math.max(1, p) + "%", height: "100%", background: "#0e0e10", borderRadius: 3 }} /></span><span style={{ width: 46, textAlign: "right", fontSize: 12.5, ...RPT_NUM }}>{rptPct(p)}</span></span>; };
  const cell = (r, bold) => <React.Fragment><span style={{ textAlign: "right", ...RPT_NUM }}>{r.units}</span><span style={{ textAlign: "right", fontWeight: bold ? 700 : 500, ...RPT_NUM }}>{rptMoney2(r.gross)}</span><span style={{ textAlign: "right", ...RPT_NUM }}>{rptMoney2(r.fund)}</span><span style={{ textAlign: "right", ...RPT_NUM }}>{rptMoney2(r.comm)}</span>{share(r.gross)}</React.Fragment>;
  const exportCsv = () => { const g = RPT_GROUPS.find((x) => x[0] === group)[1]; rptCsv("sales-by-" + group + "-" + month + ".csv", [[g, "Units", "Gross sales", "Fundraising", "Commission", "Share of total"], ...sorted.map((r) => [r.name, r.units, r.gross.toFixed(2), r.fund.toFixed(2), r.comm.toFixed(2), rptPct((r.gross / total) * 100)])]); onToast && onToast("CSV for " + m.label + " downloaded"); };
  return (
    <RptCard style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px 12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>Sales breakdown</div>
          <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 2 }}>{m.label} · same month as the commission report above. Refunded amounts are already taken out.</div>
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 12, fontWeight: 700, color: RPT.muted }}>Group by</span><RptSelect value={group} onChange={(v) => { setGroup(v); setOpen({}); }} width={170} options={RPT_GROUPS.map(([v, l]) => ({ value: v, label: l }))} /></label>
        <RptBtn small onClick={exportCsv}><IconDownload size={13} /> CSV · {m.short} {m.year}</RptBtn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb", alignItems: "center" }}>
        <span />{th("name", RPT_GROUPS.find((x) => x[0] === group)[1])}{th("units", "Units", true)}{th("gross", "Gross sales", true)}{th("fund", "Fundraising", true)}{th("comm", "Commission", true)}<RptTh style={{ textAlign: "right" }}>Share of total</RptTh>
      </div>
      {sorted.length === 0 && <div style={{ padding: "28px 24px", fontSize: 13, color: RPT.faint, textAlign: "center" }}>No sales in {m.label}.</div>}
      {sorted.map((r) => { const isOpen = !!open[r.name]; const kids = isOpen ? roll(r.lines, childKey).sort((a, b) => b.gross - a.gross) : []; return (
        <React.Fragment key={r.name}>
          <div onClick={() => setOpen((o) => ({ ...o, [r.name]: !o[r.name] }))} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "11px 24px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 13, cursor: "pointer", background: isOpen ? "#fafafb" : "#fff" }}>
            <span style={{ color: RPT.faint, display: "inline-flex", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .12s" }}><IconChevronRight size={14} /></span>
            <span style={{ fontWeight: 700, color: RPT.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
            {cell(r, true)}
          </div>
          {isOpen && kids.map((k) => (
            <div key={k.name} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "8px 24px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 12.5, background: "#fcfcfd", color: RPT.muted }}>
              <span /><span style={{ paddingLeft: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.name}</span>{cell(k, false)}
            </div>))}
        </React.Fragment>); })}
      {sorted.length > 0 && <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "11px 24px", alignItems: "center", fontSize: 13, fontWeight: 800, background: "#fafafb" }}>
        <span /><span>Total</span>{cell(rows.reduce((t, r) => ({ units: t.units + r.units, gross: t.gross + r.gross, fund: t.fund + r.fund, comm: t.comm + r.comm }), { units: 0, gross: 0, fund: 0, comm: 0 }), true)}
      </div>}
    </RptCard>
  );
}

// ══════════ Phase 3 · Still need to order ══════════
function rptTeamItems(store) {
  const own = (store && store.products || []).filter((p) => (p.teamSetting === "team-required" || p.teamSetting === "team-supplied") && !p.hidden && p.status !== "draft").map((p, i) => ({ id: p.id || "ti-" + i, title: p.title, setting: p.teamSetting }));
  return own.length ? own : DEFAULT_TEAM_GEAR.map((g) => ({ id: g.id, title: g.title.replace(/\w\S*/g, (w) => w[0] + w.slice(1).toLowerCase()), setting: g.setting }));
}
const RPT_FIRST = ["Jalen", "Omar", "Abram", "Cooper", "Davis", "Lincoln", "Ahmad", "Corey", "Jon", "Mason", "Elias", "Theo", "Nico", "Rowan", "Kai", "Miles", "Ezra", "Luca", "Jude", "Beau", "Cruz", "Ivan", "Reid", "Sol", "Ty", "Wes", "Zane", "Ari", "Max", "Finn"];
const RPT_LAST = ["Hurts", "Calzoni", "Arcand", "Curtis", "Aminoff", "Herwitz", "Stanton", "Jones", "Okafor", "Lindqvist", "Ortega", "Haddad", "Tran", "Mendes", "Brooks", "Whitfield", "Quinones", "Natarajan", "Reyes", "Kowalski"];
// Named players per roster. Most have no contact channel on file — that's the normal case.
function rptPlayersFor(org, store) {
  const rosters = typeof orgRosterList === "function" ? orgRosterList(org) : [];
  const items = rptTeamItems(store); const out = [];
  rosters.forEach((r) => {
    const n = Math.min(r.players || 0, 40); const rng = rptRng(rptSeed((store && store.id) + "|" + r.id));
    for (let i = 0; i < n; i++) {
      const first = RPT_FIRST[Math.floor(rng() * RPT_FIRST.length)]; const last = RPT_LAST[Math.floor(rng() * RPT_LAST.length)];
      const hasEmail = rng() < 0.35; const hasPhone = rng() < 0.15;
      const states = items.map((it) => { const x = rng(); return x < 0.55 ? "ordered" : x < 0.65 ? "opted" : "not"; });
      out.push({ id: r.id + "-" + i, first, last, name: first + " " + last, number: String(1 + Math.floor(rng() * 44)), roster: r.name, rosterId: r.id, email: hasEmail ? (first[0] + last).toLowerCase() + "@example.com" : "", phone: hasPhone ? "(801) 555-01" + String(10 + Math.floor(rng() * 89)) : "", states, ordered: states.filter((s) => s === "ordered").length, resolved: states.filter((s) => s !== "not").length });
    }
  });
  return { players: out, items, rostered: out.length > 0 };
}
function rptStoreOrg(store) { try { return typeof makeRosterOrg === "function" ? makeRosterOrg(store, !!(store && store.__fresh)) : { groups: [], loose: [] }; } catch (e) { return { groups: [], loose: [] }; } }

function NeedToOrderCard({ stores, month, onOpen, compact }) {
  const lines = React.useMemo(() => rptLines(stores, month).filter((l) => l.team), [stores, month]);
  const units = lines.reduce((t, l) => t + l.units, 0);
  const m = rptMonths(24).find((x) => x.key === month) || {};
  return (
    <RptCard style={compact ? { padding: "18px 20px" } : undefined}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".07em", color: RPT.muted, textTransform: "uppercase" }}>Team gear sold</div>
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 32, fontWeight: 800, color: RPT.ink, lineHeight: 1, marginTop: 10, ...RPT_NUM }}>{units.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600, color: RPT.muted }}>units</span></div>
          <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 8 }}>Team-required and team-supplied items, bundles included · {m.label}</div>
        </div>
        <RptBtn small onClick={onOpen}>Who still needs to order <IconChevronRight size={13} /></RptBtn>
      </div>
    </RptCard>
  );
}
function NeedToOrderPage({ store, org, month, onBack, onToast, onAddPlayers }) {
  const data = React.useMemo(() => rptPlayersFor(org || rptStoreOrg(store), store), [org, store]);
  const lines = React.useMemo(() => rptStoreLines(store, month).filter((l) => l.team), [store, month]);
  const m = rptMonths(24).find((x) => x.key === month) || {};
  const [onlyMissing, setOnlyMissing] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState({});
  const [bulk, setBulk] = React.useState(false);
  const canReach = (p) => !!(p.email || p.phone);
  const players = data.players.filter((p) => (!onlyMissing || p.resolved < data.items.length) && (!q || (p.name + " " + p.roster).toLowerCase().includes(q.toLowerCase())));
  const selIds = Object.keys(sel).filter((k) => sel[k]); const selPlayers = data.players.filter((p) => selIds.includes(p.id));
  const reachable = selPlayers.filter(canReach); const unreachable = selPlayers.filter((p) => !canReach(p));
  const missingCount = data.players.filter((p) => p.resolved < data.items.length).length;
  const storeLink = "https://prolookstores.com/join/" + (typeof storeCodeOf === "function" ? storeCodeOf(store) : "STORE");
  const copyLink = () => { try { navigator.clipboard && navigator.clipboard.writeText(storeLink); } catch (e) {} onToast && onToast("Store link copied"); };
  const exportCsv = () => { rptCsv("still-need-to-order-" + month + ".csv", [["Player", "Roster", ...data.items.map((i) => i.title), "Ordered"], ...players.map((p) => [p.name, p.roster, ...p.states.map((s) => s === "ordered" ? "Ordered" : s === "opted" ? "Opted out" : "Not ordered"), p.ordered + " of " + data.items.length])]); onToast && onToast("CSV downloaded"); };
  const stateCell = (s) => s === "ordered" ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: RPT.muted }}><span style={{ color: RPT.green, display: "inline-flex" }}><IconCheck size={12} /></span>Ordered</span> : s === "opted" ? <span style={{ fontSize: 12, color: RPT.faint }}>Opted out</span> : <span style={{ display: "inline-flex", fontSize: 11.5, fontWeight: 700, color: RPT.ink, background: RPT.amberBg, borderRadius: 4, padding: "2px 7px" }}>Not ordered</span>;
  const head = (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
      <div>
        <button type="button" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: 0, cursor: "pointer", color: RPT.muted, fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 8, fontFamily: "inherit" }}><IconChevronLeft size={16} /> Back to reports</button>
        <h2 data-screen-label="Still need to order" style={{ fontFamily: "Archivo, sans-serif", fontSize: 24, fontWeight: 800, margin: 0, color: RPT.ink, letterSpacing: "-.01em" }}>Still need to order</h2>
        <div style={{ fontSize: 13.5, color: RPT.muted, marginTop: 6 }}>{store.storeTitle || store.teamName}{data.rostered ? " · " + data.players.length + " players · " + data.items.length + " team items" : " · team-required and team-supplied orders"}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <RptBtn small onClick={exportCsv}><IconDownload size={13} /> Export</RptBtn>
        {data.rostered && <RptBtn small primary disabled={selIds.length === 0} title={selIds.length === 0 ? "Select players first" : undefined} onClick={() => setBulk(true)}><IconMail size={13} /> Send reminder{selIds.length ? " (" + selIds.length + ")" : ""}</RptBtn>}
      </div>
    </div>
  );
  if (!data.rostered) {
    return (
      <div>
        {head}
        <RptCard style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 12px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>What's been bought · {m.label}</div>
            <div style={{ fontSize: 12.5, color: RPT.muted }}><strong style={{ color: RPT.ink }}>{lines.reduce((t, l) => t + l.units, 0)}</strong> units across <strong style={{ color: RPT.ink }}>{lines.length}</strong> orders</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "120px minmax(180px,1.4fr) minmax(160px,1fr) 110px 70px 110px", gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb" }}><RptTh>Order</RptTh><RptTh>Item</RptTh><RptTh>Bought by</RptTh><RptTh>Setting</RptTh><RptTh right>Qty</RptTh><RptTh right>Date</RptTh></div>
          {lines.length === 0 && <div style={{ padding: "28px 24px", fontSize: 13, color: RPT.faint, textAlign: "center" }}>No team gear orders in {m.label}.</div>}
          {lines.map((l) => <div key={l.id} style={{ display: "grid", gridTemplateColumns: "120px minmax(180px,1.4fr) minmax(160px,1fr) 110px 70px 110px", gap: 12, padding: "11px 24px", borderBottom: "1px solid #f4f4f5", fontSize: 13, alignItems: "center" }}><span style={{ fontFamily: RPT_MONO, fontSize: 12, fontWeight: 700 }}>{l.id}</span><span style={{ fontWeight: 600 }}>{l.product}</span><span style={{ color: RPT.muted }}>{l.buyer}</span><span><RptPill text={l.team === "team-required" ? "Required" : "Supplied"} /></span><span style={{ textAlign: "right", ...RPT_NUM }}>{l.units}</span><span style={{ textAlign: "right", color: RPT.muted }}>{l.dateLabel}</span></div>)}
        </RptCard>
        {/* Below the data, never above it, never a blocker. */}
        <div style={{ marginTop: 20, background: "#fff", border: "1px solid " + RPT.line, borderRadius: 12, padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>Add a roster to see who hasn't ordered.</div>
            <div style={{ fontSize: 13, color: RPT.muted, lineHeight: 1.55, marginTop: 6 }}>Right now this page shows what's been bought. With a roster it also shows which players are still missing their gear, and lets you remind them.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}><RptBtn primary onClick={() => onAddPlayers ? onAddPlayers("add") : onToast && onToast("Add players from the My Team tab")}>Add players</RptBtn><RptBtn onClick={() => onAddPlayers ? onAddPlayers("csv") : onToast && onToast("Import a CSV from the My Team tab")}>Import from CSV</RptBtn></div>
        </div>
      </div>
    );
  }
  const grid = "32px minmax(200px,1.4fr) " + data.items.map(() => "minmax(120px,1fr)").join(" ") + " 110px 150px";
  return (
    <div>
      {head}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 260 }}><span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: RPT.faint, display: "inline-flex" }}><IconSearch size={14} /></span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players or rosters" style={{ width: "100%", height: 38, boxSizing: "border-box", border: "1px solid #d4d4d8", borderRadius: 6, padding: "0 12px 0 32px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }} /></div>
        <button type="button" onClick={() => setOnlyMissing((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 14px", borderRadius: 6, border: "1px solid " + (onlyMissing ? "#0e0e10" : "#d4d4d8"), background: onlyMissing ? "#0e0e10" : "#fff", color: onlyMissing ? "#fff" : RPT.ink, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Not ordered only <span style={{ fontSize: 11, opacity: .7 }}>{missingCount}</span></button>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: RPT.muted }}>{players.length} of {data.players.length} players</span>
      </div>
      <div style={{ background: "#fff", border: "1px solid " + RPT.line, borderRadius: 12, overflow: "auto", maxHeight: 640, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "10px 20px", borderBottom: "1px solid #ececf0", background: "#fafafb", position: "sticky", top: 0, zIndex: 3, alignItems: "center", minWidth: "max-content" }}>
          <Checkbox checked={players.length > 0 && players.every((p) => sel[p.id])} onChange={(v) => setSel(v ? Object.fromEntries(players.map((p) => [p.id, true])) : {})} size={15} />
          <RptTh style={{ position: "sticky", left: 0 }}>Player</RptTh>
          {data.items.map((it) => <RptTh key={it.id}>{it.title} <span style={{ fontWeight: 600, color: "#c4c4c8" }}>· {it.setting === "team-required" ? "Req" : "Sup"}</span></RptTh>)}
          <RptTh>Ordered</RptTh><RptTh>Reminder</RptTh>
        </div>
        {players.length === 0 && <div style={{ padding: "32px 20px", fontSize: 13, color: RPT.faint, textAlign: "center" }}>{onlyMissing ? "Every player has resolved every item." : "No players match."}</div>}
        {players.map((p) => { const reach = canReach(p); return (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "10px 20px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 13, minWidth: "max-content", background: sel[p.id] ? "#fafafb" : "#fff" }}>
            <Checkbox checked={!!sel[p.id]} onChange={(v) => setSel((s) => ({ ...s, [p.id]: v }))} size={15} />
            <span style={{ position: "sticky", left: 0, background: "inherit", minWidth: 0 }}><span style={{ display: "block", fontWeight: 700, color: RPT.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name} <span style={{ color: RPT.faint, fontWeight: 500 }}>#{p.number}</span></span><span style={{ display: "block", fontSize: 11.5, color: RPT.faint }}>{p.roster}</span></span>
            {p.states.map((s, i) => <span key={i}>{stateCell(s)}</span>)}
            <span style={{ fontSize: 12.5, color: p.resolved === data.items.length ? RPT.muted : RPT.ink, fontWeight: 600, ...RPT_NUM }}>{p.ordered} of {data.items.length}{p.resolved > p.ordered ? <span style={{ color: RPT.faint, fontWeight: 500 }}> · {p.resolved - p.ordered} opted out</span> : null}</span>
            <span>{reach ? <RptBtn small disabled={p.resolved === data.items.length} title={p.resolved === data.items.length ? "Nothing left to order" : "Send to " + p.email} onClick={() => onToast && onToast("Reminder sent to " + p.name + " at " + p.email)}>Send reminder</RptBtn>
              : <span style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}><RptBtn small disabled title="No email or phone on file">Send reminder</RptBtn><span style={{ fontSize: 10.5, color: RPT.faint }}>No email or phone on file</span></span>}</span>
          </div>); })}
      </div>
      <Modal open={bulk} onClose={() => setBulk(false)} width={520}>
        <div style={{ padding: "28px 28px 8px" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: "Archivo, sans-serif" }}>Send to {reachable.length} of {selPlayers.length}</h2>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: RPT.muted, lineHeight: 1.55 }}>{unreachable.length > 0 ? unreachable.length + " player" + (unreachable.length === 1 ? " has" : "s have") + " no email or phone on file, so the reminder can't reach them. " : "Every selected player has an email on file. "}The email lists the items each player still needs and links to the store.</p>
          {unreachable.length > 0 && (
            <div style={{ marginTop: 16, background: RPT.soft, borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: RPT.ink, marginBottom: 6 }}>Share the store link with these {unreachable.length} instead</div>
              <div style={{ fontSize: 12, color: RPT.muted, lineHeight: 1.5 }}>{unreachable.map((p) => p.name).join(", ")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}><span style={{ fontFamily: RPT_MONO, fontSize: 12, color: RPT.ink, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{storeLink}</span><RptBtn small onClick={copyLink}>Copy link</RptBtn></div>
            </div>)}
        </div>
        <div style={{ padding: "20px 28px", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="secondary" onClick={() => setBulk(false)}>Cancel</Button>
          <Button variant="primary" disabled={reachable.length === 0} onClick={() => { setBulk(false); setSel({}); onToast && onToast("Reminder sent to " + reachable.length + " player" + (reachable.length === 1 ? "" : "s")); }}>Send to {reachable.length}</Button>
        </div>
      </Modal>
    </div>
  );
}

// ══════════ Workspace-level Reports page (account menu → Reports) ══════════
function WorkspaceReports({ stores, origin = "overview", onBack }) {
  const live = React.useMemo(() => (stores || []).filter((s) => s.kind !== "fan"), [stores]);
  const [month, setMonth] = React.useState(() => window.__rptMonth || rptDefaultMonth());
  React.useEffect(() => { window.__rptMonth = month; }, [month]);
  const [toast, setToast] = useRptToast();
  const [needStore, setNeedStore] = React.useState(null);
  const viewer = rptViewer(live);
  const withTeam = live.filter((s) => rptStoreLines(s, month).some((l) => l.team) || !s.__fresh);
  const backLabel = origin === "stores" ? "Back to stores" : origin === "vault" ? "Back to stock vault" : "Back to overview";
  return (
    <div style={{ flex: 1, minWidth: 0, padding: "24px 32px 80px", background: "#fbfbfc" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        {needStore ? (
          <NeedToOrderPage store={needStore} month={month} onBack={() => setNeedStore(null)} onToast={setToast} />
        ) : (
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
              <div>
                <button type="button" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: 0, cursor: "pointer", color: RPT.muted, fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 8, fontFamily: "inherit" }}><IconChevronLeft size={16} /> {backLabel}</button>
                <h1 data-screen-label="Reports" style={{ fontFamily: "Archivo, sans-serif", fontSize: 30, fontWeight: 800, margin: 0, color: RPT.ink, letterSpacing: "-.01em" }}>Reports</h1>
                <div style={{ fontSize: 13.5, color: RPT.muted, marginTop: 6 }}>Every store on your workspace. Commission settles monthly; the month you pick here applies to everything below.</div>
              </div>
              <RptMonthPicker value={month} onChange={setMonth} />
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <CommissionReport stores={live} month={month} setMonth={setMonth} viewer={viewer} onToast={setToast} />
              <SalesBreakdown stores={live} month={month} onToast={setToast} />
              <RptCard style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px 12px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>Still need to order</div>
                  <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 2 }}>Team gear sold per store in {rptMonthLabel(month)}. Open a store to see who's still missing gear.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(200px,1.4fr) 120px 120px 160px", gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb" }}><RptTh>Store</RptTh><RptTh right>Units</RptTh><RptTh right>Orders</RptTh><RptTh>Roster</RptTh></div>
                {withTeam.map((s) => { const ls = rptStoreLines(s, month).filter((l) => l.team); const pl = rptPlayersFor(rptStoreOrg(s), s); return (
                  <div key={s.id} onClick={() => setNeedStore(s)} style={{ display: "grid", gridTemplateColumns: "minmax(200px,1.4fr) 120px 120px 160px", gap: 12, padding: "11px 24px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 13, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafb")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                    <span style={{ fontWeight: 700, color: RPT.ink, display: "flex", alignItems: "center", gap: 8 }}>{s.storeTitle || s.teamName}<IconChevronRight size={13} style={{ color: RPT.faint }} /></span>
                    <span style={{ textAlign: "right", ...RPT_NUM }}>{ls.reduce((t, l) => t + l.units, 0)}</span><span style={{ textAlign: "right", ...RPT_NUM }}>{ls.length}</span>
                    <span style={{ fontSize: 12.5, color: RPT.muted }}>{pl.rostered ? pl.players.length + " players" : "No roster yet"}</span>
                  </div>); })}
              </RptCard>
            </div>
          </React.Fragment>
        )}
      </div>
      <RptToastHost text={toast} />
    </div>
  );
}

// ══════════ Store Reports tab additions — commission strip + team gear card ══════════
function StoreCommissionStrip({ store, viewer }) {
  const [month, setMonth] = React.useState(() => rptDefaultMonth());
  const lines = React.useMemo(() => rptStoreLines(store, month), [store, month]);
  const s = rptSum(lines); const m = rptMonths(24).find((x) => x.key === month) || {};
  const prevKey = rptPrevMonth(month); const prev = prevKey ? rptSum(rptStoreLines(store, prevKey)) : null;
  const delta = prev && prev.grossComm > 0 ? ((s.grossComm - prev.grossComm) / prev.grossComm) * 100 : null;
  const share = rptRepShare(store.createdBy || viewer) / 100;
  return (
    <RptCard style={{ marginBottom: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1fr) minmax(280px, 1.2fr)", gap: 28, alignItems: "end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".07em", color: RPT.muted, textTransform: "uppercase" }}>Commission earned</span>
            <RptSelect value={month} onChange={setMonth} width={190} style={{ height: 30, fontSize: 12 }} options={rptMonths(13).map((x) => ({ value: x.key, label: x.label + (x.current ? " · in progress" : "") }))} />
          </div>
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 40, fontWeight: 800, color: RPT.ink, lineHeight: 1.05, letterSpacing: "-.02em", marginTop: 10, ...RPT_NUM }}>{rptMoney(s.grossComm)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 12.5, flexWrap: "wrap" }}>
            {delta != null && <span style={{ fontWeight: 700, color: delta >= 0 ? RPT.green : RPT.red }}>{delta >= 0 ? "▲" : "▼"} {rptPct(Math.abs(delta))}</span>}
            <span style={{ color: RPT.muted }}>{delta != null ? "vs " + rptMonthLabel(prevKey) + " · " : ""}net payable <strong style={{ color: RPT.ink, ...RPT_NUM }}>{rptMoney(s.net)}</strong>{s.reversals > 0 ? " after " + rptMoney(s.reversals) + " in reversals" : ""}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: RPT.muted }}>Your share <strong style={{ color: RPT.ink, ...RPT_NUM }}>{rptMoney(s.net * share)}</strong> · Organization <strong style={{ color: RPT.ink, ...RPT_NUM }}>{rptMoney(s.net * (1 - share))}</strong> · <button type="button" onClick={() => window.__goWorkspaceReports && window.__goWorkspaceReports(month)} style={{ background: "transparent", border: 0, padding: 0, fontSize: 12.5, fontWeight: 700, color: RPT.ink, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Full report</button></div>
        </div>
        <div><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: RPT.faint, textTransform: "uppercase", marginBottom: 8 }}>Net commission · last 12 months</div><RptTrend stores={[store]} month={month} onPick={setMonth} height={64} /></div>
      </div>
    </RptCard>
  );
}

// ══════════ Workspace Settings · User Management (roles & commission split) ══════════
const RPT_ROLE_DESC = { admin: "Full workspace control", rep: "Builds and runs stores", manager: "Reports and rosters for assigned stores" };
function UserManagementSection({ stores }) {
  const [tick, setTick] = React.useState(0);
  const [toast, setToast] = useRptToast();
  const viewer = rptViewer(stores);
  const reps = rptReps(stores).filter((r) => r.name !== "Unassigned");
  const users = reps.map((r, i) => ({ name: r.name, email: r.name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "") + "@prolook.com", role: r.name === viewer ? "admin" : "rep", stores: r.stores.length }));
  const setShare = (name, v) => { const n = Math.max(0, Math.min(100, Math.round(+v || 0))); window.__wsRepSplit = { ...(window.__wsRepSplit || {}), [name]: n }; setTick((t) => t + 1); };
  const grid = "minmax(200px,1.4fr) 110px 90px minmax(220px,1fr)";
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, fontFamily: "Archivo, sans-serif", color: "#09090b" }}>User Management</h3>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0, maxWidth: 640, lineHeight: 1.55 }}>Who's on the workspace, their role, and how each rep's commission divides between the Organization and the rep. Commission is the tier spread on every sale; the split sets who keeps what.</p>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "10px 18px", borderBottom: "1px solid #ececf0", background: "#fafafb", alignItems: "center" }}><RptTh>User</RptTh><RptTh>Role</RptTh><RptTh right>Stores</RptTh><RptTh>Commission split · Organization / Rep</RptTh></div>
        {users.map((u, i) => { const rep = rptRepShare(u.name); return (
          <div key={u.name} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "12px 18px", borderBottom: i < users.length - 1 ? "1px solid #f4f4f5" : "none", alignItems: "center", fontSize: 13 }}>
            <span style={{ minWidth: 0 }}><span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 700, color: RPT.ink }}>{u.name}</span>{u.name === viewer && <RptPill text="You" tone="dark" />}</span><span style={{ display: "block", fontSize: 12, color: RPT.muted, marginTop: 2 }}>{u.email}</span></span>
            <span><RptPill text={u.role === "admin" ? "Admin" : "Rep"} tone={u.role === "admin" ? "green" : "grey"} /><span style={{ display: "block", fontSize: 11, color: RPT.faint, marginTop: 4 }}>{RPT_ROLE_DESC[u.role]}</span></span>
            <span style={{ textAlign: "right", ...RPT_NUM }}>{u.stores}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1, height: 8, borderRadius: 4, background: RPT.soft, overflow: "hidden", display: "flex" }}><span style={{ width: (100 - rep) + "%", background: "#a1a1aa" }} /><span style={{ width: rep + "%", background: "#0e0e10" }} /></span>
              <span style={{ fontSize: 12.5, color: RPT.muted, whiteSpace: "nowrap", ...RPT_NUM }}>{100 - rep} /</span>
              <span style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d4d4d8", borderRadius: 6, height: 32, padding: "0 8px", width: 70, boxSizing: "border-box", background: "#fff" }}><input type="number" min={0} max={100} value={rep} onChange={(e) => setShare(u.name, e.target.value)} onBlur={() => setToast(u.name + " keeps " + rptRepShare(u.name) + "% — applies to new orders")} style={{ width: "100%", border: 0, outline: 0, fontSize: 13, fontFamily: "inherit", ...RPT_NUM }} /><span style={{ fontSize: 12, color: RPT.muted }}>%</span></span>
            </span>
          </div>); })}
      </div>
      <div style={{ fontSize: 11.5, color: RPT.faint, marginTop: 10, lineHeight: 1.5 }}>Changing a split applies to new orders only. Reports read these rates for the month they're viewing.</div>
      <RptToastHost text={toast} />
    </div>
  );
}

Object.assign(window, { WorkspaceReports, StoreCommissionStrip, NeedToOrderCard, NeedToOrderPage, CommissionReport, SalesBreakdown, UserManagementSection });
