import { Router } from "express";
import { getPortfolioData } from "../controllers/portfolioController.js";

const router = Router();

router.get("/", getPortfolioData);

export default router;
