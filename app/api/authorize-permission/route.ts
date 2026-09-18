import { requirePermission } from '@/utils/requirePermissionHelper';
import { NextRequest, NextResponse } from 'next/server';
import { ur } from 'zod/v4/locales/index.js';

export async function GET(req: NextRequest) {
  try {
    console.log('Authorization request received');

    let action: string = '';

    const url = new URL(req.url);
    const path = url.searchParams.get('path');

    const id = path?.split('/').pop();

    if (path?.includes('assign') && !id) {
      action = 'assign';
    } else if (path?.includes('assign') && id) {
      action = 'reschedule';
    }

    await requirePermission(action);

    //  const hasPermission = await requirePermission();
    //   // Call the requirePermission function to check if the user has the necessary permissions
    // if (!hasPermission) {
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }
    return NextResponse.json({ message: 'Authorized' }, { status: 200 });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { error: 'There was an internal error. Try again later' },
      { status: 500 },
    );
  }
}
