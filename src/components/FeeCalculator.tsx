"use client";

import { useMemo, useState } from "react";

interface Props {
  name: string;
  takerPct: number;
  makerPct: number;
  avgTakerPct: number;
}

function usd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

export default function FeeCalculator({ name, takerPct, makerPct, avgTakerPct }: Props) {
  const [amount, setAmount] = useState(1000);

  const { takerCost, makerCost, avgCost, savings } = useMemo(() => {
    const a = Number.isFinite(amount) && amount > 0 ? amount : 0;
    const takerCost = (a * takerPct) / 100;
    const makerCost = (a * makerPct) / 100;
    const avgCost = (a * avgTakerPct) / 100;
    return { takerCost, makerCost, avgCost, savings: avgCost - takerCost };
  }, [amount, takerPct, makerPct, avgTakerPct]);

  const box: React.CSSProperties = {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: 10,
    padding: "14px 16px",
    textAlign: "center",
  };

  return (
    <div style={{ border: "1px solid var(--glass-border)", borderRadius: 12, padding: "18px 20px", background: "var(--glass-bg)" }}>
      <label style={{ display: "block", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        Trade size (USD)
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-secondary)" }}>$</span>
        <input
          type="number"
          min={0}
          step={100}
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: "var(--color-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: 8,
            padding: "10px 12px",
            color: "var(--color-text)",
            fontSize: 18,
            fontWeight: 700,
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        <div style={box}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Taker fee ({takerPct}%)</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-primary)" }}>{usd(takerCost)}</div>
        </div>
        <div style={box}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Maker fee ({makerPct}%)</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{usd(makerCost)}</div>
        </div>
        <div style={box}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>vs category avg</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: savings >= 0 ? "#22c55e" : "#ef4444" }}>
            {savings >= 0 ? "−" : "+"}{usd(Math.abs(savings))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "12px 0 0" }}>
        Estimated cost of a single {name} trade at base-tier fees, before token or volume discounts. A negative
        &ldquo;vs average&rdquo; means {name} is cheaper than the typical exchange we track.
      </p>
    </div>
  );
}
