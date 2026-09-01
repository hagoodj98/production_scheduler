import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { z } from 'zod';
import { NextResponse, NextRequest } from 'next/server';

export async function authenticateAdmin(payload: NextRequest) {
  try {
    const body = await payload.json();
    await adminAccessValidationSchema.parseAsync(body);
    return NextResponse.json({ message: 'Admin access validated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', error: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: 'Validation failed', error }, { status: 400 });
  }
}
