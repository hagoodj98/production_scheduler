import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { CustomError } from '@/utils/CustomErrors';
import { NextResponse, NextRequest } from 'next/server';
export async function GET(req: NextRequest) {
  // Implement the logic to fetch the authentication status here
  try {
    const userName = await checkAuthMetaData();
    return NextResponse.json({ userName });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to fetch auth status' }, { status: 500 });
  }
}
