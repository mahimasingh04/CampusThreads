// utils/crypto.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashAccessCode = async (code: string): Promise<string> => {
  return bcrypt.hash(code, SALT_ROUNDS);
};

export const compareAccessCode = async (
  code: string, 
  hash: string | null
): Promise<boolean> => {
  if (!hash) return false;
  return bcrypt.compare(code, hash);
};