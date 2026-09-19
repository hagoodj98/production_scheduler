import { CustomError } from '@/utils/CustomErrors';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Handles errors and returns appropriate NextResponse JSON objects based on error type.
export function handleError(error: unknown) {
  console.error('Error occurred:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 },
    );
  }
  if (error instanceof CustomError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { error: 'There was an internal error. Try again later' },
    { status: 500 },
  );
}
