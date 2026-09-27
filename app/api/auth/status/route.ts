import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
import { NextResponse } from 'next/server';

export async function GET() {
  // API route for checking the authentication status of the user
  try {
    // Check the authentication status of the user
    const userName = await checkAuthMetaData();
    // Return the authentication status as a JSON response
    return NextResponse.json({ userName });
  } catch (error) {
    // Log the error for debugging purposes
    handleError(error);
  }
}
