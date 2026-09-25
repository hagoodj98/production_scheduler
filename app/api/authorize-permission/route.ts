import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/ErrorHandlingHelper';
import PERMISSIONS from '@/utils/Permissions';
export async function GET(req: NextRequest) {
  try {
    let action: string = '';

    const url = new URL(req.url);
    const path = url.searchParams.get('path');

    const id = path?.split('/').pop();
    if (path?.includes('add-resource')) {
      action = PERMISSIONS.add?.name;
    }
    // Determine the action based on the path and id
    if (path?.includes(PERMISSIONS.assign?.name) && !Number(id)) {
      action = PERMISSIONS.assign?.name;
    } else if (path?.includes(PERMISSIONS.assign?.name) && Number(id)) {
      action = PERMISSIONS.reschedule?.name;
    }

    await checkAuthMetaData(action, path);

    return NextResponse.json({ message: 'Authorized' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
