import { NextRequest, NextResponse } from 'next/server';
import { selectedResource } from '@/lib/repositories';
import { resourceSchema } from '@/app/validation/resourceSchemas';
import { decrypt, validateSession } from '@/lib/session';
import { PayloadSession } from '@/app/components/types';
import { cookies } from 'next/headers';
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No session cookie found' },
        { status: 401 },
      );
    }
    const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
    if (!payloadSession.permissions.includes('add')) {
      return NextResponse.json(
        { success: false, error: 'You are unauthorized to add this resource' },
        { status: 403 },
      );
    }

    const rawData = await req.json();
    const addResource = resourceSchema.parse(rawData).resource_name;
    try {
      await validateSession();
    } catch (error) {
      console.error('Unauthorized access attempt', error);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await selectedResource.create(addResource);
    return NextResponse.json(
      { message: `Successfully added resource ${addResource}` },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to add resource' }, { status: 500 });
  }
}
