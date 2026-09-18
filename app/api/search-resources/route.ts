import { NextRequest, NextResponse } from 'next/server';
import { resource } from '@/lib/repositories';
import { requirePermission } from '@/utils/requirePermissionHelper';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('add');
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';

    // Use a case-insensitive "startsWith" search so queries like "Pr" match "Press #1"
    const dbResources = await resource.findByNamePrefix(name);

    return NextResponse.json({
      resources: dbResources,
    });
  } catch (error) {
    console.error('Error searching resources:', error);
    return NextResponse.json(
      { success: false, error: 'Error searching resources' },
      { status: 500 },
    );
  }
}
