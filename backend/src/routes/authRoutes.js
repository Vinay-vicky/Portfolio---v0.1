import express from 'express';
import {
	getRecoveryStatus,
	login,
	recoverAdminAccess,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/recovery-status', getRecoveryStatus);
router.post('/recover', recoverAdminAccess);

export default router;
