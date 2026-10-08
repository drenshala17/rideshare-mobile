import "server-only";

import { neon } from "@neondatabase/serverless";

export function getSql() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Missing POSTGRES_URL environment variable.");
  }

  return neon(connectionString);
}