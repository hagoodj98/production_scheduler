import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/ErrorHandlingHelper';
import { PERMISSIONS } from '@/utils/GlobalVar';
// API route for checking user permissions
export async function GET(req: NextRequest) {
  try {
    let action: string = '';
    const url = new URL(req.url);
    const path = url.searchParams.get('path');
    // Extract the ID from the path for further permission checks
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
    // Check if the action is determined before proceeding with authorization
    await checkAuthMetaData(action, path);

    return NextResponse.json({ message: 'Authorized' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
