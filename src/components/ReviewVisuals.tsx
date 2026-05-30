import Link from "next/link";
import { brandColor, type SubScore } from "@/data/exchange-reviews";
import type { Exchange } from "@/data/exchanges";

function pct(n: number): string {
  return `${n.toFixed(n < 0.1 ? 3 : 2)}%`;
}

// ── Logo monogram (brand-colored tile; not the actual trademarked logo) ──────
export function Monogram({ name, slug, size = 56 }: { name: string; slug: string; size?: number }) {
  const color = brandColor(slug);
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.5,
        flexShrink: 0,
        boxShadow: `0 4px 16px ${color}40`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ── Overall score ring ───────────────────────────────────────────────────────
export function ScoreRing({ value, max = 5, size = 92 }: { value: number; max?: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, value / max));
  const color = frac >= 0.8 ? "#22c55e" : frac >= 0.6 ? "#6366f1" : frac >= 0.4 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--glass-border)" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.26} fontWeight={800} fill="var(--color-text)">
        {value.toFixed(1)}
      </text>
      <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.13} fill="var(--color-text-secondary)">
        / {max}
      </text>
    </svg>
  );
}

// ── Scorecard (labeled bars) ─────────────────────────────────────────────────
export function ScorecardBars({ scores }: { scores: SubScore[] }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {scores.map((s) => {
        const w = Math.max(0, Math.min(100, (s.value / 10) * 100));
        const color = s.value >= 8 ? "#22c55e" : s.value >= 6 ? "#6366f1" : s.value >= 4 ? "#f59e0b" : "#ef4444";
        return (
          <div key={s.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr 36px", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{s.label}</span>
            <span style={{ background: "var(--glass-border)", borderRadius: 999, height: 8, overflow: "hidden" }}>
              <span style={{ display: "block", width: `${w}%`, height: "100%", background: color, borderRadius: 999 }} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right" }}>{s.value.toFixed(1)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Fee comparison bar ───────────────────────────────────────────────────────
export function FeeBar({ name, taker, avg, min }: { name: string; taker: number; avg: number; min: number }) {
  const max = Math.max(taker, avg, min);
  const rows: { label: string; v: number; color: string }[] = [
    { label: name, v: taker, color: "var(--color-primary)" },
    { label: "Category average", v: avg, color: "#8b949e" },
    { label: "Cheapest tracked", v: min, color: "#22c55e" },
  ];
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "150px 1fr 56px", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{r.label}</span>
          <span style={{ background: "var(--glass-border)", borderRadius: 6, height: 18, overflow: "hidden" }}>
            <span style={{ display: "block", width: `${max ? (r.v / max) * 100 : 0}%`, height: "100%", background: r.color, borderRadius: 6 }} />
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right" }}>{pct(r.v)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Peer comparison table ────────────────────────────────────────────────────
const US_LABEL: Record<Exchange["usAvailability"], string> = { yes: "Yes", restricted: "Restricted", no: "No" };

export function ComparisonTable({ current, peers }: { current: Exchange; peers: Exchange[] }) {
  const rows = [current, ...peers];
  const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--glass-border)" };
  const td: React.CSSProperties = { padding: "12px", fontSize: 14, borderBottom: "1px solid var(--glass-border)" };
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--glass-border)", borderRadius: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
        <thead>
          <tr>
            <th style={th}>Exchange</th>
            <th style={th}>Rating</th>
            <th style={th}>Maker</th>
            <th style={th}>Taker</th>
            <th style={th}>US</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.slug} style={e.slug === current.slug ? { background: "var(--glass-bg)" } : undefined}>
              <td style={{ ...td, fontWeight: 700 }}>
                {e.slug === current.slug ? e.name : <Link href={`/exchanges/${e.slug}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>{e.name}</Link>}
              </td>
              <td style={td}>{e.rating.toFixed(1)}</td>
              <td style={td}>{pct(e.spotFee.maker)}</td>
              <td style={td}>{pct(e.spotFee.taker)}</td>
              <td style={td}>{US_LABEL[e.usAvailability]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
