import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '../app/components/types';
import { cookies } from 'next/headers';
const secretKey = process.env.SESSION_SECRET;
// Encode the secret key for use with the jose library
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  const expirationTime = payload.expiresAt;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify session', error);
  }
}
export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  const session = await encrypt({ userId: userId, role: 'user', expiresAt });
  const cookieStore = await cookies();
  // Set the session cookie with the encrypted session token
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
