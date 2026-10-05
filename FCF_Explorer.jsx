import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from "recharts";

// Palette: ink / teal (strength) / orange (gap or risk)
const C = { ink: "#1b2a41", teal: "#1f7a8c", org: "#d9480f", grey: "#8d99ae", light: "#e9ecef", gold: "#e0a100", bg: "#f4f6f8" };
const serif = "Georgia, 'Times New Roman', serif";
const sans = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const TEAMS = [
  [2021, "Beasts", 3, 1, 6], [2021, "Wild Aces", 2, 2, 6, "champ"], [2021, "Zappers", 2, 2, 4], [2021, "Glacier Boyz", 1, 3, -16, "runner"],
  [2022, "Bored Ape FC", 5, 2, 24, "runner"], [2022, "Knights of Degen", 4, 3, 58], [2022, "Shoulda Been Stars", 4, 3, 24], [2022, "8oki", 4, 3, -22],
  [2022, "Glacier Boyz", 3, 4, 6], [2022, "Kingpins", 3, 4, -34], [2022, "Zappers", 3, 4, -38, "champ"], [2022, "Beasts", 2, 5, -18],
].map(([season, team, w, l, diff, tag]) => ({ season, team, w, l, diff, tag }));

const HYP = [
  ["Capital dependence", 2, 2, 2, "Operator said a cash crunch ended season 3; $40M Series A was capital, not revenue."],
  ["Player retention", 2, 1, 2, "Only 40% of 2021 players returned despite a $100/week raise. Well documented, causally indirect."],
  ["Crypto exposure", 2, 1, 1, "Series A led by Web3 investors; reporting tied funding loss to the crypto downturn."],
  ["Audience monetization", 1, 2, 1, "No disclosed revenue, subscribers or sponsorship figures. Rests on absence of evidence."],
  ["Competitive timing", 2, 0, 1, "2022 season opened the same day as the USFL, but reported reach grew that year."],
  ["Venue economics", 1, 1, 1, "Atlanta-only model; no attendance or ticketing data public."],
  ["Product complexity", 1, 1, 0, "Real-time fan play-calling is core, but cost and failure data are not public."],
];

const NODES = {
  prod: { x: 10, y: 20, t: "Fan-control product", d: "Viewers vote on plays in real time. Strong novelty and interactivity.", k: "ok" },
  aud: { x: 250, y: 20, t: "Large digital reach", d: "735K week-one views in 2021, 2.1M at playoffs, 2.4M/week in 2022 (self-reported platform views).", k: "ok" },
  mon: { x: 490, y: 20, t: "Monetization unproven", d: "No audited revenue, subscriber or sponsorship figure is public. This is the central gap.", k: "gap" },
  exp: { x: 10, y: 130, t: "Rapid scale-up", d: "Four teams to eight after the January 2022 raise.", k: "mid" },
  cap: { x: 250, y: 130, t: "Capital dependence", d: "$40M Series A led by Animoca Brands and Delphi Digital. Capital raised, not revenue.", k: "gap" },
  lab: { x: 490, y: 130, t: "Roster churn", d: "40% of 2021 players returned (league-provided; denominator not published).", k: "gap" },
  shock: { x: 250, y: 240, t: "Capital shock", d: "Funding deteriorated in late 2022; reporting linked it to the crypto downturn.", k: "gap" },
  end: { x: 490, y: 240, t: "Season 3 cancelled", d: "June 2023: cash crunch, pivot to technology licensing and franchise sales.", k: "end" },
};
const EDGES = [["prod", "aud"], ["aud", "mon"], ["mon", "cap"], ["cap", "exp"], ["cap", "shock", 1], ["shock", "end", 1], ["cap", "lab", 0], ["lab", "end", 0]];
const FILL = { ok: "#fff", mid: "#fff", gap: "#fff", end: C.ink };
const EDGE = { ok: C.teal, mid: C.ink, gap: C.org, end: C.ink };

const Card = ({ title, note, children }) => (
  <section style={{ background: "#fff", border: `1px solid ${C.light}`, borderRadius: 6, padding: 20, marginBottom: 20 }}>
    <h2 style={{ fontFamily: serif, fontSize: 20, margin: "0 0 4px", color: C.ink }}>{title}</h2>
    {note && <p style={{ margin: "0 0 14px", color: C.grey, fontSize: 13, maxWidth: 640, lineHeight: 1.5 }}>{note}</p>}
    {children}
  </section>
);

function Audience() {
  const fcf = [{ n: "2021 wk 1", v: 0.735 }, { n: "2021 playoffs", v: 2.1 }, { n: "2022 opening", v: 2.5 }, { n: "2022 weekly avg", v: 2.4 }];
  const tv = [{ n: "USFL 2022", v: 695 }, { n: "XFL 2023", v: 622 }, { n: "UFL 2024", v: 832 }];
  const chart = (data, color, unit) => (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 18, right: 8, left: -10 }}>
        <XAxis dataKey="n" tick={{ fontSize: 11, fill: C.ink }} axisLine={{ stroke: C.ink }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [v + unit, ""]} />
        <Bar dataKey="v" fill={color} radius={[3, 3, 0, 0]}><LabelList dataKey="v" position="top" fontSize={11} fill={C.ink} /></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  return (
    <Card title="Two audience families, never one axis" note="FCF reports platform live views. The USFL, XFL and UFL report panel-measured average viewers per game. These are different quantities, so they are drawn separately and not ranked against each other.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
        <div><b style={{ fontSize: 13 }}>FCF: live views (millions, self-reported)</b>{chart(fcf, C.teal, "M")}</div>
        <div><b style={{ fontSize: 13 }}>Comparators: average viewers per game (thousands)</b>{chart(tv, C.ink, "K")}</div>
      </div>
      <p style={{ fontSize: 13, color: C.org, margin: "8px 0 0" }}>Missing from the public record: subscribers, sponsorship, ticketing, audited revenue.</p>
    </Card>
  );
}

function Teams() {
  const [season, setSeason] = useState(2022);
  const rows = useMemo(() => TEAMS.filter((t) => t.season === season).sort((a, b) => b.diff - a.diff), [season]);
  const col = (t) => (t.tag === "champ" ? C.gold : t.diff >= 0 ? C.teal : C.org);
  return (
    <Card title="Competitive product" note={season === 2022 ? "The 2022 champion Zappers finished 3-4 and ranked 8th of 8 in point differential. Playoff outcomes were largely decoupled from regular-season strength." : "Wild Aces won the 2021 People's Championship, 46-40 over Glacier Boyz."}>
      <div role="group" aria-label="Season" style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[2021, 2022].map((s) => (
          <button key={s} onClick={() => setSeason(s)} aria-pressed={season === s}
            style={{ padding: "6px 14px", border: `1.5px solid ${C.ink}`, background: season === s ? C.ink : "#fff", color: season === s ? "#fff" : C.ink, borderRadius: 4, cursor: "pointer", fontFamily: sans }}>{s}</button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={rows.length * 34 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ left: 40, right: 30 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="team" width={130} tick={{ fontSize: 12, fill: C.ink }} axisLine={false} tickLine={false} />
          <ReferenceLine x={0} stroke={C.ink} />
          <Tooltip formatter={(v, n, p) => [`${v > 0 ? "+" : ""}${v} (${p.payload.w}-${p.payload.l})`, "Point diff"]} />
          <Bar dataKey="diff" radius={2}>{rows.map((t, i) => <Cell key={i} fill={col(t)} />)}<LabelList dataKey="diff" position="right" fontSize={11} /></Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 12, color: C.grey, margin: 0 }}>Gold = champion. Teal = positive differential. Orange = negative.</p>
    </Card>
  );
}

function Runway() {
  const [raise, setRaise] = useState(40);
  const [exp, setExp] = useState(140);
  const [rev, setRev] = useState(80);
  const burn = Math.max(exp - rev, 0), months = burn ? (raise / burn) * 12 : Infinity;
  const Slide = ({ l, v, set, max }) => (
    <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
      {l}: <b>${v}M</b>
      <input type="range" min={0} max={max} value={v} onChange={(e) => set(+e.target.value)} style={{ display: "block", width: "100%", accentColor: C.org }} />
    </label>
  );
  return (
    <Card title="Capital runway sketch" note="FCF's real revenue and costs are not public. Defaults use the XFL's reported 2023 figures ($80M revenue, $140M expenses) purely to show how quickly a raise is absorbed. Change the inputs to test your own assumptions.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28, alignItems: "center" }}>
        <div>
          <Slide l="Capital raised" v={raise} set={setRaise} max={100} />
          <Slide l="Annual expenses" v={exp} set={setExp} max={200} />
          <Slide l="Annual revenue" v={rev} set={setRev} max={200} />
        </div>
        <div style={{ borderLeft: `3px solid ${C.org}`, paddingLeft: 18 }}>
          <div style={{ fontFamily: serif, fontSize: 44, color: months < 12 ? C.org : C.teal, lineHeight: 1 }}>{isFinite(months) ? months.toFixed(1) : "No burn"}</div>
          <div style={{ fontSize: 13, color: C.ink, marginTop: 6 }}>{isFinite(months) ? `months of runway at a $${burn}M annual net burn` : "Revenue covers expenses: no runway limit."}</div>
        </div>
      </div>
    </Card>
  );
}

function Evidence() {
  const [s, setS] = useState(HYP.map((h) => [h[1], h[2], h[3]]));
  const rows = HYP.map((h, i) => ({ name: h[0], note: h[4], sc: s[i], tot: s[i].reduce((a, b) => a + b, 0), i })).sort((a, b) => b.tot - a.tot);
  const set = (i, j, v) => setS((p) => p.map((r, k) => (k === i ? r.map((x, m) => (m === j ? v : x)) : r)));
  return (
    <Card title="Re-code the evidence" note="Score each hypothesis 0-2 on: documented in the public record, causal proximity to shutdown, and FCF-specific evidence. The ranking updates. The defaults are the paper's judgments, not measurements.">
      {rows.map((r) => (
        <div key={r.name} style={{ padding: "10px 0", borderTop: `1px solid ${C.light}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: serif, fontSize: 16 }}><span>{r.name}</span><b style={{ color: r.tot >= 5 ? C.org : C.ink }}>{r.tot}/6</b></div>
          <div style={{ height: 6, background: C.light, borderRadius: 3, margin: "6px 0" }}><div style={{ width: `${(r.tot / 6) * 100}%`, height: 6, background: r.tot >= 5 ? C.org : C.teal, borderRadius: 3, transition: "width .25s" }} /></div>
          <div style={{ fontSize: 12, color: C.grey, marginBottom: 6 }}>{r.note}</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12 }}>
            {["Documented", "Proximity", "FCF-specific"].map((l, j) => (
              <label key={l}>{l} <select value={r.sc[j]} onChange={(e) => set(r.i, j, +e.target.value)}>{[0, 1, 2].map((n) => <option key={n}>{n}</option>)}</select></label>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

function Mechanism() {
  const [sel, setSel] = useState("mon");
  const mid = (k) => { const n = NODES[k]; return [n.x + 85, n.y + 30]; };
  return (
    <Card title="Failure mechanism" note="Select a step. Orange outlines mark the strongest-documented chain: capital dependence, capital shock, cancellation.">
      <svg viewBox="0 0 600 320" style={{ width: "100%", maxWidth: 700 }} role="img" aria-label="Failure mechanism diagram">
        <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={C.ink} /></marker></defs>
        {EDGES.map(([a, b, strong], i) => { const [x1, y1] = mid(a), [x2, y2] = mid(b); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strong ? C.org : C.grey} strokeWidth={strong ? 2 : 1.4} strokeDasharray={strong ? "" : "5 4"} markerEnd="url(#ar)" />; })}
        {Object.entries(NODES).map(([k, n]) => (
          <g key={k} onClick={() => setSel(k)} onKeyDown={(e) => e.key === "Enter" && setSel(k)} tabIndex={0} style={{ cursor: "pointer" }} role="button" aria-label={n.t}>
            <rect x={n.x} y={n.y} width={170} height={60} rx={8} fill={sel === k ? C.ink : FILL[n.k]} stroke={EDGE[n.k]} strokeWidth={n.k === "gap" ? 2.5 : 1.5} />
            <text x={n.x + 85} y={n.y + 34} textAnchor="middle" fontSize={13} fontFamily={sans} fill={sel === k || n.k === "end" ? "#fff" : C.ink}>{n.t}</text>
          </g>
        ))}
      </svg>
      <p style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.5, borderLeft: `3px solid ${C.teal}`, paddingLeft: 14, margin: "8px 0 0" }}><b>{NODES[sel].t}.</b> {NODES[sel].d}</p>
    </Card>
  );
}

const TABS = [["Thesis", null], ["Audience", Audience], ["Teams", Teams], ["Capital", Runway], ["Mechanism", Mechanism], ["Evidence", Evidence]];

export default function FCFExplorer() {
  const [tab, setTab] = useState("Thesis");
  const View = TABS.find((t) => t[0] === tab)[1];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "28px 16px", fontFamily: sans, color: C.ink }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontFamily: serif, fontSize: 34, margin: 0, lineHeight: 1.15 }}>Reach Without Revenue</h1>
        <p style={{ color: C.grey, margin: "6px 0 18px" }}>An interactive companion to the paper on why Fan Controlled Football failed, 2021-2023.</p>
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }} aria-label="Sections">
          {TABS.map(([n]) => (
            <button key={n} onClick={() => setTab(n)} aria-current={tab === n}
              style={{ padding: "7px 14px", fontFamily: sans, fontSize: 14, cursor: "pointer", border: "none", borderBottom: `3px solid ${tab === n ? C.org : "transparent"}`, background: "transparent", color: C.ink, fontWeight: tab === n ? 700 : 400 }}>{n}</button>
          ))}
        </nav>
        {View ? <View /> : (
          <Card title="FCF did not fail for lack of attention">
            <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.6, margin: "0 0 12px" }}>The league reported nearly 10M live views in 2021 and 2.4M per week in 2022, raised $40M, and doubled to eight teams. About 17 months after the raise, it cancelled its third season.</p>
            <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.6, margin: 0 }}>The best-supported explanation is an engagement-to-capital gap: reach was never matched by disclosed revenue, operations depended on investor capital with heavy crypto exposure, and only 40% of players returned. No audited financials are public, so this is an inference, not a proven single cause.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
