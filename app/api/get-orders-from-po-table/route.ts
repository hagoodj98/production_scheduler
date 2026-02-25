import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const resources = await prisma.productionOrder.findMany({
    include: {
      resource: true,
    },
  });

  console.log(resources);

  return NextResponse.json({ resources });
}
