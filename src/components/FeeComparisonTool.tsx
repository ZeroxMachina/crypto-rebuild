"use client";

import { useMemo, useState } from "react";
import {
  exchanges,
  sortExchanges,
  EXCHANGE_DATA_AS_OF,
  EXCHANGE_METHODOLOGY,
  type ExchangeSortKey,
  type Exchange,
} from "@/data/exchanges";
import { dexes, DEX_DATA_AS_OF, DEX_METHODOLOGY } from "@/data/dexes";

type View = "cex" | "dex";
type Direction = "asc" | "desc";

function pct(n: number): string {
  return `${n.toFixed(n < 0.1 ? 3 : 2)}%`;
}

function confidenceBadge(c: Exchange["dataConfidence"]) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    high: { bg: "rgba(34,197,94,0.15)", fg: "#22c55e", label: "verified" },
    medium: { bg: "rgba(245,158,11,0.15)", fg: "#f59e0b", label: "partial" },
    "needs-verification": { bg: "rgba(239,68,68,0.15)", fg: "#ef4444", label: "unverified" },
  };
  const s = map[c] ?? map.medium;
  return (
    <span
      title={`Data confidence: ${c}`}
      style={{ background: s.bg, color: s.fg, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 999, whiteSpace: "nowrap" }}
    >
      {s.label}
    </span>
  );
}

const US_LABEL: Record<Exchange["usAvailability"], string> = {
  yes: "✓ US",
  restricted: "~ US*",
  no: "✗ US",
};

function goHref(slug: string): string {
  return `/go/${slug}?utm_source=fee-comparison&utm_medium=tool&utm_campaign=fees&utm_content=${slug}`;
}

export default function FeeComparisonTool() {
  const [view, setView] = useState<View>("cex");
  const [sortKey, setSortKey] = useState<ExchangeSortKey>("spotTaker");
  const [direction, setDirection] = useState<Direction>("asc");

  const sortedExchanges = useMemo(() => sortExchanges(sortKey, direction), [sortKey, direction]);
  const sortedDexes = useMemo(() => [...dexes].sort((a, b) => b.rating - a.rating), []);

  function setSort(key: ExchangeSortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(key === "name" ? "asc" : key === "rating" || key === "coins" ? "desc" : "asc");
    }
  }

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: "var(--color-text-secondary)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    borderBottom: "1px solid var(--glass-border)",
    cursor: "pointer",
    userSelect: "none",
  };
  const tdStyle: React.CSSProperties = {
    padding: "12px",
    fontSize: 14,
    color: "var(--color-text)",
    borderBottom: "1px solid var(--glass-border)",
    verticalAlign: "middle",
  };

  const sortArrow = (key: ExchangeSortKey) => (key === sortKey ? (direction === "asc" ? " ▲" : " ▼") : "");

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: 999,
    border: `1px solid ${active ? "var(--color-primary)" : "var(--glass-border)"}`,
    background: active ? "var(--color-primary)" : "transparent",
    color: active ? "#fff" : "var(--color-text)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  });

  const ctaStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 8,
    background: "var(--color-primary)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button style={tabBtn(view === "cex")} onClick={() => setView("cex")}>
          Exchanges (CEX) · {exchanges.length}
        </button>
        <button style={tabBtn(view === "dex")} onClick={() => setView("dex")}>
          DEXes · {dexes.length}
        </button>
      </div>

      {view === "cex" ? (
        <>
          <div style={{ overflowX: "auto", border: "1px solid var(--glass-border)", borderRadius: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => setSort("name")}>Exchange{sortArrow("name")}</th>
                  <th style={thStyle} onClick={() => setSort("spotMaker")}>Maker{sortArrow("spotMaker")}</th>
                  <th style={thStyle} onClick={() => setSort("spotTaker")}>Taker{sortArrow("spotTaker")}</th>
                  <th style={thStyle}>Futures (mkr/tkr)</th>
                  <th style={thStyle}>US</th>
                  <th style={thStyle} onClick={() => setSort("rating")}>Rating{sortArrow("rating")}</th>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {sortedExchanges.map((e) => (
                  <tr key={e.slug}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700 }}>{e.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{e.bestFor}</div>
                    </td>
                    <td style={tdStyle}>{pct(e.spotFee.maker)}</td>
                    <td style={tdStyle}>{pct(e.spotFee.taker)}</td>
                    <td style={tdStyle}>{e.futuresFee ? `${pct(e.futuresFee.maker)} / ${pct(e.futuresFee.taker)}` : "—"}</td>
                    <td style={tdStyle}>{US_LABEL[e.usAvailability]}</td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700 }}>{e.rating.toFixed(1)}</span>
                      <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>/5</span>
                    </td>
                    <td style={tdStyle}>{confidenceBadge(e.dataConfidence)}</td>
                    <td style={tdStyle}>
                      <a href={goHref(e.slug)} rel="sponsored nofollow" style={ctaStyle}>Visit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 10 }}>
            * &ldquo;~ US&rdquo; = available to US users with restrictions. Spot fees are base-tier maker/taker before token or volume discounts.
          </p>
          <Methodology asOf={EXCHANGE_DATA_AS_OF} text={EXCHANGE_METHODOLOGY} />
        </>
      ) : (
        <>
          <div style={{ overflowX: "auto", border: "1px solid var(--glass-border)", borderRadius: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={thStyle}>DEX</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Chain</th>
                  <th style={thStyle}>Fee model</th>
                  <th style={thStyle}>Referral</th>
                  <th style={thStyle}>Rating</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {sortedDexes.map((d) => (
                  <tr key={d.slug}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{d.bestFor}</div>
                    </td>
                    <td style={tdStyle}>{d.type}</td>
                    <td style={tdStyle}>{d.primaryChain}</td>
                    <td style={{ ...tdStyle, fontSize: 12, maxWidth: 280 }}>{d.feeModel}</td>
                    <td style={tdStyle}>
                      {d.hasReferralProgram ? (
                        <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 12 }}>Yes</span>
                      ) : (
                        <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>No</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700 }}>{d.rating.toFixed(1)}</span>
                      <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>/5</span>
                    </td>
                    <td style={tdStyle}>
                      <a href={goHref(d.slug)} rel="sponsored nofollow" style={ctaStyle}>Visit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 10 }}>
            DEX fee structures are heterogeneous (LP tiers, perp maker/taker, aggregator routing), so the fee model is described per protocol rather than as a single rate.
          </p>
          <Methodology asOf={DEX_DATA_AS_OF} text={DEX_METHODOLOGY} />
        </>
      )}
    </div>
  );
}

function Methodology({ asOf, text }: { asOf: string; text: string }) {
  return (
    <details style={{ marginTop: 16, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "12px 16px" }}>
      <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--color-text)" }}>
        Methodology &amp; data as of {asOf}
      </summary>
      <p style={{ marginTop: 10, marginBottom: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{text}</p>
    </details>
  );
}
