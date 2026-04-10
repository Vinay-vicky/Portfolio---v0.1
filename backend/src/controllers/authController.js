import jwt from 'jsonwebtoken';
import {
  CredentialValidationError,
  isRecoveryKeyConfigured,
  isValidRecoveryKey,
  resetAdminCredentials,
  verifyAdminCredentials,
} from '../services/adminCredentialsService.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const verification = await verifyAdminCredentials({ username, password });
    if (!verification.ok) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { role: 'admin', username: verification.username },
      getJwtSecret(),
      { expiresIn: '1d' },
    );

    return res.status(200).json({ token, message: 'Logged in successfully.' });
  } catch (error) {
    if (error instanceof CredentialValidationError) {
      return res.status(400).json({ error: error.message });
    }

    return next(error);
  }
};

export const recoverAdminAccess = async (req, res, next) => {
  try {
    const {
      recoveryKey,
      username,
      newPassword,
      password,
    } = req.body || {};

    const targetPassword = newPassword || password;

    if (!recoveryKey || !username || !targetPassword) {
      return res.status(400).json({
        error: 'recoveryKey, username and newPassword are required.',
      });
    }

    if (!isRecoveryKeyConfigured()) {
      return res.status(503).json({
        error: 'Recovery key is not configured. Set ADMIN_RECOVERY_KEY in backend environment.',
      });
    }

    if (!isValidRecoveryKey(recoveryKey)) {
      return res.status(401).json({ error: 'Invalid recovery key.' });
    }

    const updated = await resetAdminCredentials({
      username,
      password: targetPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin credentials were reset successfully. You can now log in with the new credentials.',
      username: updated.username,
    });
  } catch (error) {
    if (error instanceof CredentialValidationError) {
      return res.status(400).json({ error: error.message });
    }

    return next(error);
  }
};

export const getRecoveryStatus = (_req, res) => {
  res.status(200).json({
    recoveryEnabled: isRecoveryKeyConfigured(),
  });
};
