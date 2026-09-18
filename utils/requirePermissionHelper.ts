import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '../lib/session';
import type { PayloadSession } from '../app/components/types';

// Helper function to check if the user has the required permission before proceeding
export const requirePermission = async (permission: string) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ success: false, error: 'No session cookie found' }, { status: 401 });
  }
  const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
  if (!payloadSession.permissions.includes(permission)) {
    throw new Error(`You are unauthorized to ${permission} this resource`);
  }
};
