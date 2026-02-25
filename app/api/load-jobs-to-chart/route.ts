import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const ResourceProductionOrders = await prisma.selectedResource.findMany({
    select: {
      id: true,
      resource_name: true,
      productionOrders: {
        select: {
          id: true,
          dayMonthYear: true,
          startTime: true,
          endTime: true,
          resourceStatus: true,
          resourceId: true,
        },
      },
    },
  });

  return NextResponse.json({ ResourceProductionOrders }, { status: 200 });
}
