import { NextRequest, NextResponse } from 'next/server';
import { selectedResource, orderLog } from '@/lib/repositories';
import { resourceSchema } from '@/app/validation/resourceSchemas';
import { handleError } from '@/utils/ErrorHandlingHelper';
import { PERMISSIONS } from '@/utils/GlobalVar';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
// API route to add a new resource
export async function POST(req: NextRequest) {
  try {
    // Check if the user has the 'add' permission before proceeding
    const { employeeId } = await checkAuthMetaData(PERMISSIONS.add?.name);
    const rawData = await req.json();
    const addResource = resourceSchema.parse(rawData).resource_name;
    // Extract the resource name from the validated data
    const newResource = await selectedResource.create(addResource);
    await orderLog.createOrderLog(
      undefined,
      employeeId,
      `Added resource ${newResource.resource_name}`,
    );
    return NextResponse.json(
      { message: `Successfully added resource ${newResource.resource_name}` },
      { status: 200 },
    );
  } catch (error) {
    // Handle any errors that occur during the resource addition process
    return handleError(error);
  }
}
