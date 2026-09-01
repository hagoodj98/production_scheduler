import { NextResponse, NextRequest } from 'next/server';
import { adminAccessValidationSchema } from '../../../utils/validationSchema';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!payload) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    await adminAccessValidationSchema.parseAsync(payload);
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
