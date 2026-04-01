import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnvPath = path.resolve(__dirname, "../../.env");
const rootEnvPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: backendEnvPath });

if (fs.existsSync(rootEnvPath)) {
  const rootVars = dotenv.parse(fs.readFileSync(rootEnvPath));
  for (const [key, value] of Object.entries(rootVars)) {
    if (!process.env[key] || process.env[key].trim() === "") {
      process.env[key] = value;
    }
  }
}

const localDbPath = path.resolve(__dirname, "../../data/portfolio.db");
const url = process.env.TURSO_DATABASE_URL?.trim() || `file:${localDbPath}`;

export const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
});
