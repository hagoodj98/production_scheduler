import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/ErrorHandlingHelper';

export async function GET(req: NextRequest) {
  try {
    let action: string = '';

    const url = new URL(req.url);
    const path = url.searchParams.get('path');

    const id = path?.split('/').pop();

    if (path?.includes('assign') && !id) {
      action = 'assign';
    } else if (path?.includes('assign') && id) {
      action = 'reschedule';
    }

    await checkAuthMetaData(action);

    return NextResponse.json({ message: 'Authorized' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
