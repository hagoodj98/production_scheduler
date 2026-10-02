import crypto from 'crypto';
// Utility function to hash passwords using SHA-256
export function hashPassword(p: string) {
  return crypto.createHash('sha256').update(p).digest('hex');
}
