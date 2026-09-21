import { NextRequest, NextResponse } from 'next/server';
import { selectedResource } from '@/lib/repositories';
import { resourceSchema } from '@/app/validation/resourceSchemas';
import { validateSession } from '@/lib/session';
import { handleError } from '@/utils/ErrorHandlingHelper';

import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
export async function POST(req: NextRequest) {
  try {
    // Check if the user has the 'add' permission before proceeding
    await checkAuthMetaData('add');
    const rawData = await req.json();
    const addResource = resourceSchema.parse(rawData).resource_name;
    await validateSession();

    await selectedResource.create(addResource);
    return NextResponse.json(
      { message: `Successfully added resource ${addResource}` },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
