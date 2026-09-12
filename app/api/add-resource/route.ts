import { NextRequest, NextResponse } from 'next/server';
import { selectedResource } from '@/lib/repositories';
import { resourceSchema } from '@/app/validation/resourceSchemas';
import { validateSession } from '@/lib/session';
export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const addResource = resourceSchema.parse(rawData).resource_name;
    try {
      await validateSession();
    } catch (error) {
      console.error('Unauthorized access attempt', error);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await selectedResource.create(addResource);
    return NextResponse.json({ message: `received endpoint` }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to add resource' }, { status: 500 });
  }
}
