//Create predefined resources in a server component
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET() {
  const resources = await prisma.resource.findMany();
  return NextResponse.json({ resources });
}
