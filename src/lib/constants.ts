// Working brand name — rename when the brand domain lands.
export const SITE_NAME = "Crypto Rebuild";

// Set NEXT_PUBLIC_SITE_URL on the deployment (Vercel env) to the real origin.
// Used for canonical URLs and JSON-LD. Falls back to localhost in dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
