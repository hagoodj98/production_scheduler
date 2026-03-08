import { NextRequest, NextResponse } from "next/server";
import { resourceRepository } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  // Use a case-insensitive "startsWith" search so queries like "Pr" match "Press #1"
  const dbResources = await resourceRepository.findByNamePrefix(name);

  return NextResponse.json({
    resources: dbResources,
  });
}
