import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { NextResponse, NextRequest } from 'next/server';
export const GET = async (req: NextRequest) => {
  // Implement the logic to fetch the authentication status here
  try {
    const userName = await checkAuthMetaData();
    return NextResponse.json({ userName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch auth status' }, { status: 500 });
  }
};
