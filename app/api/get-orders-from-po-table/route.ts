import { productionOrderRepository } from "@/lib/repositories";
import { NextResponse } from "next/server";

export async function GET() {
  const resources = await productionOrderRepository.findAll();

  return NextResponse.json({ resources });
}
