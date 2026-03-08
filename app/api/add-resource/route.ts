import { NextRequest, NextResponse } from "next/server";
import { selectedResourceRepository } from "@/lib/repositories";
import { resourceSchema } from "@/app/validation/resourceSchemas";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();

    const addResource = resourceSchema.parse(rawData).resource_name;

    await selectedResourceRepository.create(addResource);

    return NextResponse.json({ message: `received endpoint` }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add resource" },
      { status: 500 },
    );
  }
}
