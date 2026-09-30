import { handleError } from '@/utils/ErrorHandlingHelper';
import { selectedResource } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all selected resources from the repository
    const resources = await selectedResource.findAll();
    return NextResponse.json({ Resources: resources }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
