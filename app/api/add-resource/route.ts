import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { resourceSchema } from "@/app/validation/resourceSchemas";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    console.log(rawData, "rawdata");

    const addResource = resourceSchema.parse(rawData).resource_name;
    //const resourceValue = rawData.resourceValue;

    await prisma.selectedResource.create({
      data: {
        resource_name: addResource,
        //resourceStatus: resourceValue
      },
    });

    return NextResponse.json({ message: `received endpoint` }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add resource" },
      { status: 500 },
    );
  }
}
