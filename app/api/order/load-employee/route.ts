import { NextResponse } from 'next/server';
import { user } from '@/lib/repositories/user';

export async function GET() {
  const employees = await user.getAll();
  return NextResponse.json(employees);
}
