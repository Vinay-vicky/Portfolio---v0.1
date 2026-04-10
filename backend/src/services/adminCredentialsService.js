import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from '../db/client.js';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/;
const MIN_PASSWORD_LENGTH = 8;

export class CredentialValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CredentialValidationError';
  }
}

const normalizeUsername = (value) => String(value || '').trim();

const safeStringCompare = (a, b) => {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
};

const buildPasswordHash = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
};

const verifyPasswordHash = (password, storedHash) => {
  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const [algorithm, salt, hash] = storedHash.split(':');
  if (algorithm !== 'scrypt' || !salt || !hash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, 64).toString('hex');
  return safeStringCompare(computedHash, hash);
};

const validateCredentialInput = ({ username, password }) => {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPassword = String(password || '');

  if (!normalizedUsername || !normalizedPassword) {
    throw new CredentialValidationError('Username and password are required.');
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    throw new CredentialValidationError(
      'Username must be 3-32 characters and can only include letters, numbers, dot, underscore, and dash.',
    );
  }

  if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
    throw new CredentialValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }

  return {
    username: normalizedUsername,
    password: normalizedPassword,
  };
};

const getActiveAdminCredential = async () => {
  const result = await db.execute({
    sql: `SELECT id, username, password_hash
          FROM admin_credentials
          ORDER BY id ASC
          LIMIT 1`,
  });

  return result.rows[0] || null;
};

const upsertAdminCredential = async ({ username, password }) => {
  const { username: validatedUsername, password: validatedPassword } = validateCredentialInput({
    username,
    password,
  });

  const passwordHash = buildPasswordHash(validatedPassword);
  const existingCredential = await getActiveAdminCredential();

  if (existingCredential) {
    await db.execute({
      sql: `UPDATE admin_credentials
            SET username = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [validatedUsername, passwordHash, existingCredential.id],
    });

    return { username: validatedUsername };
  }

  await db.execute({
    sql: `INSERT INTO admin_credentials (username, password_hash)
          VALUES (?, ?)`,
    args: [validatedUsername, passwordHash],
  });

  return { username: validatedUsername };
};

const getBootstrapUsername = () => normalizeUsername(process.env.ADMIN_USERNAME) || 'admin';
const getBootstrapPassword = () => String(process.env.ADMIN_PASSWORD || '').trim() || 'secret123';

export const ensureAdminCredentialSeeded = async () => {
  const existingCredential = await getActiveAdminCredential();
  if (existingCredential) {
    return existingCredential;
  }

  const username = getBootstrapUsername();
  const password = getBootstrapPassword();

  await upsertAdminCredential({ username, password });
  return getActiveAdminCredential();
};

export const verifyAdminCredentials = async ({ username, password }) => {
  const { username: normalizedUsername, password: normalizedPassword } = validateCredentialInput({
    username,
    password,
  });

  await ensureAdminCredentialSeeded();
  const activeCredential = await getActiveAdminCredential();

  if (!activeCredential) {
    return { ok: false, reason: 'not_configured' };
  }

  if (activeCredential.username.toLowerCase() !== normalizedUsername.toLowerCase()) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  if (!verifyPasswordHash(normalizedPassword, activeCredential.password_hash)) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  return {
    ok: true,
    username: activeCredential.username,
  };
};

export const resetAdminCredentials = async ({ username, password }) => {
  return upsertAdminCredential({ username, password });
};

export const getActiveAdminUsername = async () => {
  await ensureAdminCredentialSeeded();
  const activeCredential = await getActiveAdminCredential();
  return activeCredential?.username || getBootstrapUsername();
};

export const isRecoveryKeyConfigured = () => {
  return Boolean(String(process.env.ADMIN_RECOVERY_KEY || '').trim());
};

export const isValidRecoveryKey = (candidateKey) => {
  const configuredKey = String(process.env.ADMIN_RECOVERY_KEY || '').trim();
  if (!configuredKey) {
    return false;
  }

  const providedKey = String(candidateKey || '').trim();
  return safeStringCompare(configuredKey, providedKey);
};

export const generateStrongPassword = (length = 18) => {
  const minLength = Math.max(12, Number(length) || 18);
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  const bytes = randomBytes(minLength);
  return Array.from(bytes, (byte) => charset[byte % charset.length]).join('');
};
