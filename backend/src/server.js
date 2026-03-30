import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { initSchema } from "./db/schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const legacyAssetsPath = path.resolve(__dirname, "../../assets");

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use("/legacy-assets", express.static(legacyAssetsPath));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portfolio-backend" });
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

const start = async () => {
  await initSchema();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
