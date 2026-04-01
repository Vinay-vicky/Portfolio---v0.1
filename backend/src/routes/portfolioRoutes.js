import { Router } from "express";
import {
	createEducation,
	createExperience,
	createProject,
	createSkill,
	deleteEducation,
	deleteExperience,
	deleteProject,
	deleteSkill,
	getPortfolioData,
	updateEducation,
	updateExperience,
	updateProfile,
	updateProject,
	updateSkill,
} from "../controllers/portfolioController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getPortfolioData);

router.put("/profile", authenticateAdmin, updateProfile);

router.post("/experiences", authenticateAdmin, createExperience);
router.put("/experiences/:id", authenticateAdmin, updateExperience);
router.delete("/experiences/:id", authenticateAdmin, deleteExperience);

router.post("/education", authenticateAdmin, createEducation);
router.put("/education/:id", authenticateAdmin, updateEducation);
router.delete("/education/:id", authenticateAdmin, deleteEducation);

router.post("/skills", authenticateAdmin, createSkill);
router.put("/skills/:id", authenticateAdmin, updateSkill);
router.delete("/skills/:id", authenticateAdmin, deleteSkill);

router.post("/projects", authenticateAdmin, createProject);
router.put("/projects/:id", authenticateAdmin, updateProject);
router.delete("/projects/:id", authenticateAdmin, deleteProject);

export default router;
