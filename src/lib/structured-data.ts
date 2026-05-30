/**
 * Minimal JSON-LD generators for the pages we ship.
 * Schema.org types: SoftwareApplication, BlogPosting, FAQPage, BreadcrumbList.
 */
import { SITE_NAME, SITE_URL } from "./constants";

type Schema = Record<string, unknown>;

export function generateToolPageSchema(input: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function generateArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@type": "Person", name: input.author, url: `${SITE_URL}/authors/raul-amoros` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function generateFAQSchema(faqs: { q: string; a: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateReviewSchema(input: {
  itemName: string;
  itemType?: string;
  url: string;
  rating: number;
  bestRating?: number;
  author: string;
  datePublished: string;
  reviewBody: string;
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": input.itemType ?? "FinancialService", name: input.itemName },
    url: input.url,
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.rating,
      bestRating: input.bestRating ?? 5,
      worstRating: 0,
    },
    author: { "@type": "Person", name: input.author, url: `${SITE_URL}/authors/raul-amoros` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    datePublished: input.datePublished,
    reviewBody: input.reviewBody,
  };
}

export function generateItemListSchema(input: {
  name: string;
  description: string;
  items: { name: string; url: string }[];
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    itemListElement: input.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}

export function serializeSchema(schema: Schema | Schema[]): string {
  return JSON.stringify(Array.isArray(schema) ? schema : [schema]);
}
