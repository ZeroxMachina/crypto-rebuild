import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const AUTHOR = {
  name: "Raul Amoros",
  role: `Founder & Lead Analyst, ${SITE_NAME}`,
  url: `${SITE_URL}/authors/raul-amoros`,
  bio:
    `Raul Amoros is the founder and lead analyst of ${SITE_NAME}. He has spent years tracking crypto ` +
    "exchanges, wallets, and DeFi protocols, and writes the platform's comparison data and reviews. His " +
    "focus is simple: accurate, honestly-rated, frequently-updated information that helps people make their " +
    "own decisions — with the methodology and the gaps stated plainly rather than hidden.",
  covers: [
    "Centralized & decentralized exchanges",
    "Trading fees & cost analysis",
    "Hardware & software wallets",
    "DeFi lending, staking & yield",
    "Crypto tax tooling",
  ],
  principles: [
    'Every figure carries an "as of" date and a confidence flag.',
    "Affiliate relationships are disclosed; rankings are on merit, not commission.",
    "If something isn't independently verified, it's labeled — not dressed up.",
  ],
  sameAs: ["https://twitter.com/"],
};

export const metadata: Metadata = {
  title: `Raul Amoros — Founder & Lead Analyst`,
  description: `Raul Amoros is the founder and lead analyst of ${SITE_NAME}, covering crypto exchanges, wallets, DeFi, and tooling with honest, methodology-first analysis.`,
  alternates: { canonical: AUTHOR.url },
  openGraph: { title: "Raul Amoros", description: "Founder & lead analyst — exchanges, wallets, DeFi, and crypto tooling.", url: AUTHOR.url, type: "profile" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR.name,
  jobTitle: "Founder & Lead Analyst",
  url: AUTHOR.url,
  description: AUTHOR.bio,
  knowsAbout: AUTHOR.covers,
  worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  sameAs: AUTHOR.sameAs,
};

export default function RaulAmorosPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Authors", href: "/authors" }, { label: "Raul Amoros" }]} />

      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 6px" }}>{AUTHOR.name}</h1>
        <p style={{ margin: 0, color: "var(--color-primary)", fontWeight: 600 }}>{AUTHOR.role}</p>
      </header>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 28 }}>{AUTHOR.bio}</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12 }}>What I cover</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
          {AUTHOR.covers.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>

      <section style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 0, marginBottom: 12 }}>How I work</h2>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
          {AUTHOR.principles.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>
    </div>
  );
}
