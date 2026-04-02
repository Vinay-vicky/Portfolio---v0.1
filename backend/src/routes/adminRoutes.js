import { Router } from "express";
import { runSmtpHealthCheck } from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/smtp-test", authenticateAdmin, runSmtpHealthCheck);

export default router;
