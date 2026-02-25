import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// Deletes orders matching resourceId AND startTime.
// We use deleteMany because resourceId+startTime is not a unique constraint.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body as { orderId?: number };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    const result = await prisma.productionOrder.delete({
      where: {
        id: orderId,
      },
    });

    console.log(result);

    if (!result) {
      return NextResponse.json(
        { message: "No matching order found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete order failed", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
