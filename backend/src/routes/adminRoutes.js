import { Router } from "express";
import {
	deleteContactMessage,
	listContactMessages,
	markAllMessagesRead,
	runSmtpHealthCheck,
	updateContactMessageStatus,
} from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/smtp-test", authenticateAdmin, runSmtpHealthCheck);
router.get("/messages", authenticateAdmin, listContactMessages);
router.patch("/messages/:id/status", authenticateAdmin, updateContactMessageStatus);
router.post("/messages/mark-all-read", authenticateAdmin, markAllMessagesRead);
router.delete("/messages/:id", authenticateAdmin, deleteContactMessage);

export default router;
