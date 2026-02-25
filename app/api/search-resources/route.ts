import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  console.log(name);

  // Use a case-insensitive "startsWith" search so queries like "Pr" match "Press #1"
  const dbResources = await prisma.resource.findMany({
    where: {
      resource_name: {
        startsWith: name,
        mode: "insensitive",
      },
    },
    orderBy: { resource_name: "asc" },
    take: 100,
  });

  console.log("DB Resources:", dbResources);

  return NextResponse.json({
    resources: dbResources,
  });
}
