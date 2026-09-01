import { NextRequest, NextResponse } from 'next/server';
import { resource } from '@/lib/repositories';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';

  // Use a case-insensitive "startsWith" search so queries like "Pr" match "Press #1"
  const dbResources = await resource.findByNamePrefix(name);

  return NextResponse.json({
    resources: dbResources,
  });
}
