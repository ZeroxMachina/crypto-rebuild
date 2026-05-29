import Link from "next/link";
import { exchanges } from "@/data/exchanges";
import { dexes } from "@/data/dexes";

const cards = [
  {
    href: "/exchange-fee-index",
    title: "Exchange & DEX Fee Index",
    desc: "Maintained base-tier trading fees across major exchanges and DEXes, with methodology and an 'as of' date. Our original dataset.",
    tag: "Dataset",
  },
  {
    href: "/tools/fee-comparison",
    title: "Fee Comparison Tool",
    desc: "Sort and compare trading fees, US availability, and features side by side. Switch between centralized exchanges and DEXes.",
    tag: "Tool",
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1rem" }}>
      <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.15 }}>
        Crypto tools and data you can actually trust
      </h1>
      <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", maxWidth: 640, margin: "0 0 36px" }}>
        A focused set of best-in-class calculators and original datasets — covering{" "}
        {exchanges.length} exchanges and {dexes.length} DEXes — with honest methodology, dated figures,
        and no signup wall.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              display: "block",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--glass-radius)",
              padding: "1.5rem",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: 0.6 }}>
              {c.tag}
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", margin: "8px 0 8px" }}>{c.title}</h2>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
