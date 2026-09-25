import { NextRequest, NextResponse } from 'next/server';
import { resource } from '@/lib/repositories';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
import PERMISSIONS from '@/utils/Permissions';

export async function GET(request: NextRequest) {
  try {
    await checkAuthMetaData(PERMISSIONS.add?.name);
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';

    // Use a case-insensitive "startsWith" search so queries like "Pr" match "Press #1"
    const dbResources = await resource.findByNamePrefix(name);

    return NextResponse.json({
      resources: dbResources,
    });
  } catch (error) {
    return handleError(error);
  }
}
