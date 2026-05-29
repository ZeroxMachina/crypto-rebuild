import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Authors",
  description: "The people behind our crypto comparison data, reviews, and tools.",
  alternates: { canonical: `${SITE_URL}/authors` },
};

const AUTHORS = [
  {
    name: "Raul Amoros",
    role: "Founder & Lead Analyst",
    href: "/authors/raul-amoros",
    blurb: "Exchanges, wallets, DeFi, and crypto tooling — honest, methodology-first analysis.",
  },
];

export default function AuthorsPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Authors" }]} />
      <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 20px" }}>Authors</h1>
      <div style={{ display: "grid", gap: 14 }}>
        {AUTHORS.map((a) => (
          <Link key={a.href} href={a.href} style={{ display: "block", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "1.1rem 1.25rem", textDecoration: "none" }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)" }}>{a.name}</div>
            <div style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: ".9rem", margin: "2px 0 6px" }}>{a.role}</div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: ".95rem" }}>{a.blurb}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
