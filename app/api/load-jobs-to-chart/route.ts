import { selectedResourceRepository } from "@/lib/repositories";
import { NextResponse } from "next/server";

export async function GET() {
  const ResourceProductionOrders =
    await selectedResourceRepository.findAllWithOrders();
  console.log(ResourceProductionOrders);

  return NextResponse.json({ ResourceProductionOrders }, { status: 200 });
}
