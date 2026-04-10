import dotenv from 'dotenv';
import { initSchema } from '../db/schema.js';
import {
  CredentialValidationError,
  generateStrongPassword,
  resetAdminCredentials,
} from '../services/adminCredentialsService.js';

dotenv.config();

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const username = getArgValue('--username') || process.env.ADMIN_USERNAME || 'admin';
const passwordFromArg = getArgValue('--password');
const password = passwordFromArg || generateStrongPassword(18);

const run = async () => {
  await initSchema();

  const updated = await resetAdminCredentials({ username, password });

  console.log('✅ Admin credentials reset successfully.');
  console.log(`Username: ${updated.username}`);
  console.log(`Password: ${password}`);

  if (!passwordFromArg) {
    console.log('ℹ️ Password was generated automatically. Save it in your password manager now.');
  }
};

run().catch((error) => {
  if (error instanceof CredentialValidationError) {
    console.error(`❌ Validation error: ${error.message}`);
    process.exit(1);
  }

  console.error('❌ Failed to reset admin credentials:', error);
  process.exit(1);
});
