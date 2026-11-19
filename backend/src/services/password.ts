import bcrypt from "bcrypt";

/**
 * Work factor for bcrypt. OWASP recommends a minimum of 10; 12 is a
 * reasonable default that keeps hashing under ~300 ms on commodity hardware.
 * Raise this value over time as hardware gets faster.
 */
const BCRYPT_ROUNDS = 12;

/**
 * Hash a plaintext password using bcrypt with a randomly generated salt.
 * Never call this with an already-hashed value.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

/**
 * Constant-time comparison of a plaintext password against a stored bcrypt
 * hash. Returns false (not an error) when the hash is null, so callers that
 * have not yet set a password can be handled gracefully.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string | null | undefined,
): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plaintext, hash);
}
