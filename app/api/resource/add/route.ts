import { NextRequest, NextResponse } from 'next/server';
import { selectedResource } from '@/lib/repositories';
import { resourceSchema } from '@/app/validation/resourceSchemas';
import { handleError } from '@/utils/ErrorHandlingHelper';
import PERMISSIONS from '@/utils/Permissions';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
// API route to add a new resource
export async function POST(req: NextRequest) {
  try {
    // Check if the user has the 'add' permission before proceeding
    await checkAuthMetaData(PERMISSIONS.add?.name);
    const rawData = await req.json();
    const addResource = resourceSchema.parse(rawData).resource_name;
    // Extract the resource name from the validated data
    await selectedResource.create(addResource);
    return NextResponse.json(
      { message: `Successfully added resource ${addResource}` },
      { status: 200 },
    );
  } catch (error) {
    // Handle any errors that occur during the resource addition process
    return handleError(error);
  }
}
