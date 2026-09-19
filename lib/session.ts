import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { PayloadSession } from '../app/components/types';
import { CustomError } from '../utils/CustomErrors';

const secretKey = process.env.SESSION_SECRET;
// Encode the secret key for use with the jose library
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: PayloadSession) {
  const expirationTime = payload.expiresAt;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expirationTime.getTime() / 1000))
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError('Failed to decrypt session', 401);
    }
  }
}
export async function createSession(payload: Omit<PayloadSession, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  const session = await encrypt({ ...payload, expiresAt });
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
export async function validateSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value; // Replace 'someCookieName' with the actual cookie name you want to access

  if (!sessionToken) {
    throw new Error('Unauthorized', { cause: 'No session token found' });
  }
  return sessionToken;
}
