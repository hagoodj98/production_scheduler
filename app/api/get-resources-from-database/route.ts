//Create predefined resources in a server component
import { NextResponse } from "next/server";
import { resourceRepository } from "@/lib/repositories";

export async function GET() {
  const resources = await resourceRepository.findAll();
  return NextResponse.json({ resources });
}
