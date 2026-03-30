import path from "node:path";
import { createClient } from "@libsql/client";

const localDbPath = path.join(process.cwd(), "data", "portfolio.db");
const url = process.env.TURSO_DATABASE_URL || `file:${localDbPath}`;

export const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
