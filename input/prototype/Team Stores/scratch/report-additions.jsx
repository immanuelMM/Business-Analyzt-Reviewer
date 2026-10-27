// ══════════ Bundles & codes on reports ══════════
// A bundle is the unit of sale; its items are the unit of attribution. Orders carry
// the identity code that let the shopper in (or Retail) and, separately, any promo.
const RPT_TODAY = new Date("2026-06-04");
const RPT_SIZES = ["YM", "YL", "S", "M", "L", "XL"];
function rptR2(n) { return Math.round(n * 100) / 100; }
function rptBundles(store) {
  if (!store) return [];
  const prods = store.products || [];
  const real = prods.filter((p) => p.isBundle && (p.bundleItemIds || []).length >= 2).map((b) => {
    const items = (b.bundleItemIds || []).map((id) => prods.find((p) => p.id === id)).filter(Boolean).map((p) => ({ title: p.title, category: p.category || p.storeCategory || "Fan Gear", brand: p.brand || "Prolook", deco: "Decorated", msrp: parseFloat(p.retail || (p.pricing && p.pricing.adult && p.pricing.adult.retail) || p.priceAdult) || 50, team: p.teamSetting === "team-required" || p.teamSetting === "team-supplied" ? p.teamSetting : null }));
    return { id: b.id, title: b.title || "Bundle", items, team: b.teamSetting === "team-required" || b.teamSetting === "team-supplied" ? b.teamSetting : null };
  }).filter((b) => b.items.length >= 2);
  if (real.length) return real;
  if (!store.seeded) return [];
  const cat = rptStoreCatalog(store); const team = cat.filter((p) => p.team); const fan = cat.filter((p) => !p.team);
  const out = [];
  if (team.length >= 2) out.push({ id: "bd-team", title: "Team Gear Pack", items: team.slice(0, 3), team: "team-required" });
  if (fan.length >= 2) out.push({ id: "bd-fan", title: "Fan Pack", items: fan.slice(0, 2), team: null });
  return out;
}
function rptTeamNames(store) {
  if (!store || (store.storeType || "league") !== "league") return [];
  const reg = ((window.__wsTeamCodeRegistry || {})[store.id] || []).map((t) => t.name).filter(Boolean);
  return reg.length ? reg : ["10U Boys", "12U Boys", "12U Girls", "14U Boys"];
}
// Split a bundle line into one line per item, revenue weighted by item msrp.
function rptDecompose(lines) {
  return lines.flatMap((l) => {
    if (!l.parts) return [l];
    const tot = l.parts.reduce((t, p) => t + p.msrp, 0) || 1;
    return l.parts.map((p) => { const f = p.msrp / tot; return { ...l, product: p.title, category: p.category, brand: p.brand, deco: p.deco, team: p.team, gross: rptR2(l.gross * f), refundAmount: rptR2(l.refundAmount * f), fund: rptR2(l.fund * f), commission: rptR2(l.commission * f), reversal: rptR2(l.reversal * f), discount: rptR2((l.discount || 0) * f), fromBundle: l.product, parts: undefined }; });
  });
}
function rptPromoDiscount(promo, gross, units) { if (!promo) return 0; if (promo.type === "shipping") return 0; if (promo.type === "fixed") return rptR2(Math.min(gross, (+promo.value || 0) * units)); return rptR2(gross * (+promo.value || 0) / 100); }
function rptCodeDefs(stores) {
  const out = [];
  (stores || []).forEach((s) => { if (typeof wsStoreCodes !== "function") return; wsStoreCodes(s).forEach((c) => out.push({ ...c, storeId: s.id, storeName: s.storeTitle || s.teamName || "Store", key: s.id + "|" + c.code })); });
  return out;
}
function rptDaysLeft(end) { if (!end) return null; return Math.ceil((new Date(end + "T23:59:59") - RPT_TODAY) / 86400000); }

// ── Bundle report card (store Reports tab) ──
function BundleReportCard({ store, month, rostered, onOpen, onAddPlayers, onOpenTeamGear }) {
  const bundles = rptBundles(store);
  const lines = React.useMemo(() => rptStoreLines(store, month).filter((l) => l.bundleId), [store, month]);
  const m = rptMonths(24).find((x) => x.key === month) || {};
  if (!bundles.length) return null;
  const stats = bundles.map((b) => { const ls = lines.filter((l) => l.bundleId === b.id); return { b, units: ls.reduce((t, l) => t + l.units, 0), rev: ls.reduce((t, l) => t + l.gross - l.refundAmount, 0) }; }).sort((a, c) => c.units - a.units);
  const top = stats.slice(0, 3);
  const link = (label, fn) => <button type="button" onClick={fn} style={{ background: "transparent", border: 0, padding: 0, fontSize: "inherit", fontWeight: 700, color: RPT.ink, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>{label}</button>;
  return (
    <RptCard style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".07em", color: RPT.muted, textTransform: "uppercase" }}>Bundles sold</div>
          <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 6 }}>{m.label}{stats.length > top.length ? " · top " + top.length + " of " + stats.length : ""}</div>
        </div>
        <RptBtn small onClick={() => onOpen(null)}>{stats.length > top.length ? "All " + stats.length + " bundles" : "Details"} <IconChevronRight size={13} /></RptBtn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
        {top.map((s, i) => (
          <div key={s.b.id} onClick={() => onOpen(s.b.id)} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 16, alignItems: "center", padding: "12px 0", borderTop: i ? "1px solid #f1f1f3" : "none", cursor: "pointer" }}>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: RPT.ink }}>{s.b.title}</span>
              <span style={{ display: "block", fontSize: 12, color: RPT.muted, marginTop: 3, lineHeight: 1.45 }}>{s.b.items.map((it) => it.title).join(" · ")}</span>
            </span>
            <span style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontFamily: "Archivo, sans-serif", fontSize: 28, fontWeight: 800, color: RPT.ink, lineHeight: 1, ...RPT_NUM }}>{s.units}</span>
              <span style={{ display: "block", fontSize: 11.5, color: RPT.muted, marginTop: 4, ...RPT_NUM }}>{rptMoney(s.rev)}</span>
            </span>
          </div>))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f1f1f3", fontSize: 12, color: RPT.muted, lineHeight: 1.5 }}>
        {rostered ? <span>Bundles tell you how many; the roster tells you who. {link("See who's ordered", onOpenTeamGear)}.</span> : <span>Counts sales, not players. {link("Add a roster", onAddPlayers)} to see exactly who's ordered.</span>}
      </div>
    </RptCard>
  );
}
// Right-side drawer: all bundles, or one bundle itemised with the orders behind it.
function BundleDrawer({ store, month, bundleId, onClose }) {
  const [sel, setSel] = React.useState(bundleId);
  React.useEffect(() => { setSel(bundleId); }, [bundleId]);
  const bundles = rptBundles(store);
  const lines = React.useMemo(() => rptStoreLines(store, month).filter((l) => l.bundleId), [store, month]);
  const m = rptMonths(24).find((x) => x.key === month) || {};
  const league = (store.storeType || "league") === "league";
  const b = bundles.find((x) => x.id === sel);
  const ls = b ? lines.filter((l) => l.bundleId === b.id) : [];
  const units = ls.reduce((t, l) => t + l.units, 0); const rev = ls.reduce((t, l) => t + l.gross - l.refundAmount, 0);
  const tot = b ? b.items.reduce((t, p) => t + p.msrp, 0) || 1 : 1;
  const teams = league ? Array.from(new Set(ls.map((l) => l.teamName))).map((t) => { const tl = ls.filter((l) => l.teamName === t); return { t, units: tl.reduce((a, l) => a + l.units, 0), rev: tl.reduce((a, l) => a + l.gross - l.refundAmount, 0) }; }).sort((a, c) => c.units - a.units) : [];
  const sec = (t) => <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", color: RPT.faint, textTransform: "uppercase", margin: "22px 0 8px" }}>{t}</div>;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 650 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(9,9,11,.35)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(560px, 100vw)", background: "#fff", boxShadow: "-12px 0 40px rgba(9,9,11,.18)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: "1px solid #ececf0" }}>
          {b && bundles.length > 1 && <button type="button" onClick={() => setSel(null)} style={{ background: "transparent", border: 0, cursor: "pointer", color: RPT.muted, display: "inline-flex", padding: 4 }}><IconChevronLeft size={18} /></button>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 18, fontWeight: 800, color: RPT.ink }}>{b ? b.title : "Bundles sold"}</div>
            <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 2 }}>{store.storeTitle || store.teamName} · {m.label}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: 0, cursor: "pointer", padding: 8, color: RPT.ink, display: "inline-flex" }}><IconX size={20} style={{ strokeWidth: 2 }} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px 32px" }}>
          {!b && bundles.map((x, i) => { const xl = lines.filter((l) => l.bundleId === x.id); const u = xl.reduce((t, l) => t + l.units, 0); return (
            <div key={x.id} onClick={() => setSel(x.id)} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto 18px", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f1f3", cursor: "pointer" }}>
              <span style={{ minWidth: 0 }}><span style={{ display: "block", fontSize: 14, fontWeight: 700, color: RPT.ink }}>{x.title}</span><span style={{ display: "block", fontSize: 12, color: RPT.muted, marginTop: 2 }}>{x.items.map((it) => it.title).join(" · ")}</span></span>
              <span style={{ textAlign: "right" }}><span style={{ display: "block", fontFamily: "Archivo, sans-serif", fontSize: 22, fontWeight: 800, ...RPT_NUM }}>{u}</span><span style={{ display: "block", fontSize: 11.5, color: RPT.muted, ...RPT_NUM }}>{rptMoney(xl.reduce((t, l) => t + l.gross - l.refundAmount, 0))}</span></span>
              <span style={{ color: RPT.faint, display: "inline-flex" }}><IconChevronRight size={16} /></span>
            </div>); })}
          {b && (
            <React.Fragment>
              <div style={{ display: "flex", gap: 28, padding: "18px 0 4px" }}>
                <div><div style={{ fontFamily: "Archivo, sans-serif", fontSize: 36, fontWeight: 800, lineHeight: 1, ...RPT_NUM }}>{units}</div><div style={{ fontSize: 12, color: RPT.muted, marginTop: 6 }}>sold</div></div>
                <div><div style={{ fontFamily: "Archivo, sans-serif", fontSize: 36, fontWeight: 800, lineHeight: 1, color: RPT.ink, ...RPT_NUM }}>{rptMoney(rev)}</div><div style={{ fontSize: 12, color: RPT.muted, marginTop: 6 }}>revenue{b.team ? " · " + (b.team === "team-required" ? "team required" : "team supplied") : ""}</div></div>
              </div>
              {sec("What's inside · item sales within the bundle")}
              <div style={{ border: "1px solid " + RPT.line, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 60px 90px", gap: 12, padding: "8px 14px", background: "#fafafb", borderBottom: "1px solid #ececf0" }}><RptTh>Item</RptTh><RptTh right>Units</RptTh><RptTh right>Attributed</RptTh></div>
                {b.items.map((it, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 60px 90px", gap: 12, padding: "10px 14px", borderBottom: i < b.items.length - 1 ? "1px solid #f4f4f5" : "none", fontSize: 13, alignItems: "center" }}>
                    <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, color: RPT.ink }}>{it.title}</span><span style={{ display: "block", fontSize: 11.5, color: RPT.faint }}>{it.category}{it.team ? " · " + (it.team === "team-required" ? "Required" : "Supplied") : ""}</span></span>
                    <span style={{ textAlign: "right", ...RPT_NUM }}>{units}</span>
                    <span style={{ textAlign: "right", color: RPT.muted, ...RPT_NUM }}>{rptMoney2(rev * it.msrp / tot)}</span>
                  </div>))}
              </div>
              <div style={{ fontSize: 11.5, color: RPT.faint, marginTop: 8, lineHeight: 1.5 }}>Every bundle sold is one of each item. Revenue is attributed to items by their retail price.</div>
              {league && teams.length > 0 && (
                <React.Fragment>
                  {sec("By team")}
                  <div style={{ border: "1px solid " + RPT.line, borderRadius: 10, overflow: "hidden" }}>
                    {teams.map((t, i) => (
                      <div key={t.t} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 60px 90px", gap: 12, padding: "10px 14px", borderBottom: i < teams.length - 1 ? "1px solid #f4f4f5" : "none", fontSize: 13, alignItems: "center" }}>
                        <span style={{ fontWeight: 600, color: RPT.ink }}>{t.t}</span><span style={{ textAlign: "right", fontWeight: 700, ...RPT_NUM }}>{t.units}</span><span style={{ textAlign: "right", color: RPT.muted, ...RPT_NUM }}>{rptMoney(t.rev)}</span>
                      </div>))}
                  </div>
                </React.Fragment>
              )}
              {sec("Orders · " + ls.length)}
              {ls.length === 0 && <div style={{ fontSize: 13, color: RPT.faint, padding: "8px 0" }}>No orders for this bundle in {m.label}.</div>}
              {ls.length > 0 && (
                <div style={{ border: "1px solid " + RPT.line, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "92px minmax(0,1fr) 54px 70px 76px", gap: 10, padding: "8px 14px", background: "#fafafb", borderBottom: "1px solid #ececf0" }}><RptTh>Order</RptTh><RptTh>Buyer</RptTh><RptTh>Size</RptTh><RptTh right>Date</RptTh><RptTh right>Amount</RptTh></div>
                  {ls.slice().reverse().map((l, i) => (
                    <div key={l.id} style={{ display: "grid", gridTemplateColumns: "92px minmax(0,1fr) 54px 70px 76px", gap: 10, padding: "9px 14px", borderBottom: i < ls.length - 1 ? "1px solid #f4f4f5" : "none", fontSize: 12.5, alignItems: "center" }}>
                      <span style={{ fontFamily: RPT_MONO, fontSize: 11.5, fontWeight: 700 }}>{l.id}</span>
                      <span style={{ minWidth: 0 }}><span style={{ display: "block", color: RPT.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.buyer}</span>{league && <span style={{ display: "block", fontSize: 11, color: RPT.faint }}>{l.teamName}</span>}</span>
                      <span style={{ color: RPT.muted }}>{l.size}{l.units > 1 ? " ×" + l.units : ""}</span>
                      <span style={{ textAlign: "right", color: RPT.muted }}>{l.dateLabel}</span>
                      <span style={{ textAlign: "right", ...RPT_NUM }}>{l.refund === "full" ? <span style={{ textDecoration: "line-through", color: RPT.faint }}>{rptMoney2(l.gross)}</span> : rptMoney2(l.gross - l.refundAmount)}</span>
                    </div>))}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Store code performance (workspace Sales Reports) ──
function CodePerformance({ stores, month, onToast }) {
  const monthLines = React.useMemo(() => rptLines(stores, month), [stores, month]);
  const lifeLines = React.useMemo(() => rptMonths(24).flatMap((mm) => rptLines(stores, mm.key)), [stores]);
  const [scope, setScope] = React.useState("month");
  const [rowLife, setRowLife] = React.useState({});
  const [open, setOpen] = React.useState({});
  const m = rptMonths(24).find((x) => x.key === month) || {};
  const defs = rptCodeDefs(stores);
  const multiStore = new Set(defs.map((d) => d.storeId)).size > 1;
  const tiers = rptTiers();
  const isLife = (key) => rowLife[key] !== undefined ? rowLife[key] : scope === "life";
  const pool = (key) => (isLife(key) ? lifeLines : monthLines);
  const agg = (ls) => ({ shoppers: new Set(ls.map((l) => l.buyer)).size, orders: ls.length, gross: ls.reduce((t, l) => t + l.gross - l.refundAmount, 0), fund: ls.reduce((t, l) => t + l.fund, 0), comm: ls.reduce((t, l) => t + l.commission - l.reversal, 0), disc: ls.reduce((t, l) => t + (l.discount || 0), 0) });
  const identity = defs.filter((d) => d.caps.entry || d.caps.tier || d.caps.team).map((d) => ({ d, key: d.key, ls: pool(d.key).filter((l) => l.codeKey === d.key) })).map((r) => ({ ...r, ...agg(r.ls) }));
  identity.push((() => { const ls = pool("retail").filter((l) => !l.codeKey); return { d: { code: "Retail", label: "No code — public storefront prices", tierId: "retail", enabled: true }, key: "retail", retail: true, ls, ...agg(ls) }; })());
  identity.sort((a, b) => b.gross - a.gross);
  const promos = defs.filter((d) => d.caps.promo).map((d) => ({ d, key: d.key, ls: pool(d.key).filter((l) => l.promoKey === d.key) })).map((r) => ({ ...r, ...agg(r.ls) })).sort((a, b) => b.gross - a.gross);
  const lifePill = (key) => <button type="button" title={isLife(key) ? "Showing lifetime totals for this code — click for " + m.label : "Showing " + m.label + " — click for this code's lifetime total"} onClick={(e) => { e.stopPropagation(); setRowLife((o) => ({ ...o, [key]: !isLife(key) })); }} style={{ border: "1px solid " + (isLife(key) ? "#0e0e10" : "#e4e4e7"), background: isLife(key) ? "#0e0e10" : "#fff", color: isLife(key) ? "#fff" : RPT.muted, borderRadius: 999, padding: "2px 8px", fontSize: 10.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{isLife(key) ? "Lifetime" : m.short}</button>;
  const state = (d) => { if (d.retail) return null; if (d.enabled === false) return <RptPill text="Off" />; const dl = rptDaysLeft(d.end); if (dl !== null && dl < 0) return <RptPill text={"Expired " + wsFmtDate(d.end)} />; if (d.start && new Date(d.start + "T00:00:00") > RPT_TODAY) return <RptPill text={"Starts " + wsFmtDate(d.start)} tone="amber" />; return null; };
  const lifecycle = (d) => { const bits = []; const dl = rptDaysLeft(d.end); if (dl !== null && dl >= 0 && d.enabled !== false) bits.push(dl === 0 ? "ends today" : dl + " days left"); if (d.limit) bits.push((d.used || 0) + " / " + d.limit + " redemptions"); return bits.join(" · "); };
  const nameCell = (r) => (
    <span style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: r.retail ? "inherit" : RPT_MONO, fontSize: r.retail ? 13 : 12.5, fontWeight: 700, letterSpacing: r.retail ? 0 : ".06em", color: RPT.ink }}>{r.d.code}</span>{state(r.d)}</span>
        <span style={{ display: "block", fontSize: 11.5, color: RPT.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.d.label}{multiStore && !r.retail ? " · " + r.d.storeName : ""}{lifecycle(r.d) ? " · " + lifecycle(r.d) : ""}</span>
      </span>
    </span>);
  const orders = (r, promo) => (
    <div style={{ background: "#fcfcfd", borderBottom: "1px solid #f4f4f5" }}>
      {r.ls.length === 0 && <div style={{ padding: "10px 24px 10px 60px", fontSize: 12.5, color: RPT.faint }}>No orders {isLife(r.key) ? "yet" : "in " + m.label}.</div>}
      {r.ls.slice().reverse().slice(0, 40).map((l) => (
        <div key={l.id} style={{ display: "grid", gridTemplateColumns: "100px minmax(0,1.2fr) minmax(0,1.4fr) 90px 100px" + (promo ? " 100px" : ""), gap: 12, padding: "7px 24px 7px 60px", fontSize: 12.5, color: RPT.muted, alignItems: "center" }}>
          <span style={{ fontFamily: RPT_MONO, fontSize: 11.5, fontWeight: 700, color: RPT.ink }}>{l.id}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.buyer}{multiStore ? " · " + l.storeName : ""}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.product}{l.units > 1 ? " ×" + l.units : ""}{!promo && l.promoKey ? <span style={{ color: RPT.faint }}> · promo {l.promoCode}</span> : ""}</span>
          <span style={{ textAlign: "right" }}>{l.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</span>
          <span style={{ textAlign: "right", color: RPT.ink, ...RPT_NUM }}>{rptMoney2(l.gross - l.refundAmount)}</span>
          {promo && <span style={{ textAlign: "right", color: RPT.red, ...RPT_NUM }}>({rptMoney2(l.discount || 0)})</span>}
        </div>))}
      {r.ls.length > 40 && <div style={{ padding: "6px 24px 10px 60px", fontSize: 11.5, color: RPT.faint }}>{r.ls.length - 40} more orders not shown.</div>}
    </div>);
  const idGrid = "24px minmax(220px,1.8fr) 70px repeat(5, minmax(90px,1fr))";
  const prGrid = "24px minmax(220px,1.8fr) 70px minmax(80px,.8fr) repeat(6, minmax(90px,1fr))";
  const num = (v, bold, color) => <span style={{ textAlign: "right", fontWeight: bold ? 700 : 500, color: color || RPT.ink, ...RPT_NUM }}>{v}</span>;
  const tot = (rows) => rows.reduce((t, r) => ({ shoppers: t.shoppers + r.shoppers, orders: t.orders + r.orders, gross: t.gross + r.gross, fund: t.fund + r.fund, comm: t.comm + r.comm, disc: t.disc + r.disc }), { shoppers: 0, orders: 0, gross: 0, fund: 0, comm: 0, disc: 0 });
  const mixed = Object.keys(rowLife).some((k) => rowLife[k] !== undefined && rowLife[k] !== (scope === "life"));
  const exportCsv = () => { rptCsv("store-codes-" + month + ".csv", [["Code", "Label", "Kind", "Period", "Shoppers", "Orders", "Gross sales", "Fundraising", "Discount given", "Net sales", "Commission"], ...identity.map((r) => [r.d.code, r.d.label, "Identity", isLife(r.key) ? "Lifetime" : m.label, r.shoppers, r.orders, r.gross.toFixed(2), r.fund.toFixed(2), "", r.gross.toFixed(2), r.comm.toFixed(2)]), ...promos.map((r) => [r.d.code, r.d.label, "Promotion", isLife(r.key) ? "Lifetime" : m.label, r.shoppers, r.orders, r.gross.toFixed(2), r.fund.toFixed(2), r.disc.toFixed(2), (r.gross - r.disc).toFixed(2), r.comm.toFixed(2)])]); onToast && onToast("CSV downloaded"); };
  const rowBtn = (r, grid, cells, promo) => { const isOpen = !!open[r.key]; return (
    <React.Fragment key={r.key}>
      <div onClick={() => setOpen((o) => ({ ...o, [r.key]: !o[r.key] }))} style={{ display: "grid", gridTemplateColumns: grid, gap: 12, padding: "11px 24px", borderBottom: "1px solid #f4f4f5", alignItems: "center", fontSize: 13, cursor: "pointer", background: isOpen ? "#fafafb" : "#fff", opacity: (!r.retail && (r.d.enabled === false || (rptDaysLeft(r.d.end) !== null && rptDaysLeft(r.d.end) < 0))) ? .6 : 1 }}>
        <span style={{ color: RPT.faint, display: "inline-flex", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .12s" }}><IconChevronRight size={14} /></span>
        {nameCell(r)}
        <span>{lifePill(r.key)}</span>
        {cells}
      </div>
      {isOpen && orders(r, promo)}
    </React.Fragment>); };
  return (
    <RptCard style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 24px 14px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: RPT.ink, fontFamily: "Archivo, sans-serif" }}>Store code performance</div>
          <div style={{ fontSize: 12.5, color: RPT.muted, marginTop: 4, lineHeight: 1.5, maxWidth: 720 }}>Orders are attributed to the <strong style={{ color: RPT.ink }}>identity code</strong> that let the shopper in — Retail when there was none. A promotion on the same order is reported separately below as a discount, so an order with both appears once in each table and the two tables don't sum together.</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ display: "inline-flex", background: RPT.soft, borderRadius: 8, padding: 3 }}>
            {[["month", m.label], ["life", "Lifetime"]].map(([v, l]) => <button key={v} type="button" onClick={() => { setScope(v); setRowLife({}); }} style={{ border: 0, background: scope === v ? "#fff" : "transparent", color: scope === v ? RPT.ink : RPT.muted, borderRadius: 6, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: scope === v ? "0 1px 2px rgba(9,9,11,.08)" : "none" }}>{l}</button>)}
          </span>
          <RptBtn small onClick={exportCsv}><IconDownload size={13} /> CSV</RptBtn>
        </div>
      </div>
      {mixed && <div style={{ margin: "0 24px 12px", padding: "8px 12px", background: RPT.amberBg, color: RPT.amber, borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Some rows show lifetime totals and others {m.label} — each row's pill says which. Totals below only add rows on the same period.</div>}

      <div style={{ padding: "10px 24px 6px", fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: RPT.ink, textTransform: "uppercase", borderTop: "1px solid #ececf0" }}>Identity codes <span style={{ fontWeight: 600, color: RPT.faint, textTransform: "none", letterSpacing: 0 }}>· where shoppers came from</span></div>
      <div style={{ display: "grid", gridTemplateColumns: idGrid, gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb", alignItems: "center" }}>
        <span /><RptTh>Code · Label</RptTh><RptTh>Period</RptTh><RptTh>Tier</RptTh><RptTh right>Shoppers</RptTh><RptTh right>Orders</RptTh><RptTh right>Gross sales</RptTh><RptTh right>Fundraising</RptTh><RptTh right>Commission</RptTh>
      </div>
      {identity.map((r) => { const t = tiers.find((x) => x.id === r.d.tierId); return rowBtn(r, idGrid, <React.Fragment><span style={{ fontSize: 12.5, color: RPT.muted }}>{t ? t.name + (t.off ? " · " + t.off + "%" : "") : "—"}</span>{num(r.shoppers)}{num(r.orders)}{num(rptMoney2(r.gross), true)}{num(rptMoney2(r.fund))}{num(rptMoney2(r.comm))}</React.Fragment>); })}
      {(() => { const same = identity.filter((r) => isLife(r.key) === (scope === "life")); const t = tot(same); return (
        <div style={{ display: "grid", gridTemplateColumns: idGrid, gap: 12, padding: "10px 24px", alignItems: "center", fontSize: 13, fontWeight: 800, background: "#fafafb", borderBottom: "1px solid #ececf0" }}><span /><span>Total · {scope === "life" ? "lifetime" : m.label}{same.length < identity.length ? " · " + (identity.length - same.length) + " row" + (identity.length - same.length === 1 ? "" : "s") + " on another period left out" : ""}</span><span /><span />{num(t.shoppers, true)}{num(t.orders, true)}{num(rptMoney2(t.gross), true)}{num(rptMoney2(t.fund), true)}{num(rptMoney2(t.comm), true)}</div>); })()}

      <div style={{ padding: "16px 24px 6px", fontSize: 12, fontWeight: 800, letterSpacing: ".06em", color: RPT.ink, textTransform: "uppercase" }}>Promotion codes <span style={{ fontWeight: 600, color: RPT.faint, textTransform: "none", letterSpacing: 0 }}>· what each cost and what it brought in</span></div>
      <div style={{ display: "grid", gridTemplateColumns: prGrid, gap: 12, padding: "8px 24px", borderTop: "1px solid #ececf0", borderBottom: "1px solid #ececf0", background: "#fafafb", alignItems: "center" }}>
        <span /><RptTh>Code · Label</RptTh><RptTh>Period</RptTh><RptTh>Discount</RptTh><RptTh right>Redemptions</RptTh><RptTh right>Orders</RptTh><RptTh right>Gross sales</RptTh><RptTh right>Discount given</RptTh><RptTh right>Net sales</RptTh><RptTh right>Commission</RptTh>
      </div>
      {promos.length === 0 && <div style={{ padding: "22px 24px", fontSize: 13, color: RPT.faint, textAlign: "center" }}>No promotion codes on these stores. Create one under a store's Settings → Store Codes.</div>}
      {promos.map((r) => rowBtn(r, prGrid, <React.Fragment><span style={{ fontSize: 12.5, color: RPT.muted }}>{wsPromoText(r.d.promo)}</span>{num(r.orders)}{num(r.orders)}{num(rptMoney2(r.gross))}{num("(" + rptMoney2(r.disc) + ")", true, RPT.red)}{num(rptMoney2(r.gross - r.disc), true)}{num(rptMoney2(r.comm))}</React.Fragment>, true))}
      {promos.length > 0 && (() => { const same = promos.filter((r) => isLife(r.key) === (scope === "life")); const t = tot(same); return (
        <div style={{ display: "grid", gridTemplateColumns: prGrid, gap: 12, padding: "10px 24px", alignItems: "center", fontSize: 13, fontWeight: 800, background: "#fafafb" }}><span /><span>Total · {scope === "life" ? "lifetime" : m.label}{same.length < promos.length ? " · " + (promos.length - same.length) + " row" + (promos.length - same.length === 1 ? "" : "s") + " on another period left out" : ""}</span><span /><span />{num(t.orders, true)}{num(t.orders, true)}{num(rptMoney2(t.gross), true)}{num("(" + rptMoney2(t.disc) + ")", true, RPT.red)}{num(rptMoney2(t.gross - t.disc), true)}{num(rptMoney2(t.comm), true)}</div>); })()}
      <div style={{ padding: "10px 24px 14px", fontSize: 11.5, color: RPT.faint, lineHeight: 1.5, borderTop: "1px solid #f1f1f3" }}>Expired and disabled codes stay listed with their history. Refunded amounts are already taken out. Codes are managed on each store under Settings → Store Codes.</div>
    </RptCard>
  );
}
Object.assign(window, { BundleReportCard, BundleDrawer, CodePerformance, rptBundles, rptDecompose });
