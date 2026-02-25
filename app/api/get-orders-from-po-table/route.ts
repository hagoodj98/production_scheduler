import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const resources = await prisma.productionOrder.findMany({
    include: {
      resource: true,
    },
  });

  return NextResponse.json({ resources });
}
