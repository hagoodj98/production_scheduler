import { cookies } from 'next/headers';
import { decrypt } from '../lib/session';
import type { PayloadSession } from '../app/components/types';
import { CustomError } from './CustomErrors';
// Helper function to check if the user has the required permission before proceeding
export const checkAuthMetaData = async (permission?: string) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    throw new CustomError('No session cookie found', 401);
  }
  const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
  if (permission && !payloadSession.permissions.includes(permission)) {
    throw new CustomError(`You are unauthorized to ${permission} this resource`, 403);
  }
  return payloadSession.name;
};
