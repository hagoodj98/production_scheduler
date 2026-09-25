import { cookies } from 'next/headers';
import { decrypt } from '../lib/session';
import type { PayloadSession } from '../app/components/types';
import { CustomError } from './CustomErrors';
import PERMISSIONS from './Permissions';
// Helper function to check if the user has the required permission before proceeding
export const checkAuthMetaData = async (permission?: string, path?: string | null) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    throw new CustomError('No session cookie found', 401);
  }
  const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
  // Check if the user has the required permission in their session payload
  const hasPermission = payloadSession.permissions.find(
    // Check if the current permission matches the required permission or if the user has all access
    (p) => p === permission || p === PERMISSIONS.all_access.name,
  );
  const isWorker = payloadSession.permissions.includes(PERMISSIONS.view.name);
  // if user is a worker, they've gained unauthoruzed access to the system
  if (isWorker) {
    throw new CustomError('Unauthorized access for worker role', 403);
  }

  // Check if the user has the required permission before proceeding
  if (permission && !hasPermission) {
    if (path?.includes('add-resource')) {
      throw new CustomError(`You are unauthorized to ${permission} a resource`, 403);
    }
    // Check if the user is trying to assign an order without the appropriate permission
    if (path?.includes('assign-order') && permission !== 'reschedule') {
      throw new CustomError(`You are unauthorized to assign an order`, 403);
    }
    throw new CustomError(`You are unauthorized to ${permission} this resource`, 403);
  }
  return payloadSession.name;
};
