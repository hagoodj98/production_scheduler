import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { loopThroughScheduledJobs } from "@/task/schedulerTask";
import { CustomError } from "@/utils/CustomErrors";

export async function POST() {
  try {
    const getAllRequestedJobs = await prisma.productionOrder.findMany({
      select: {
        id: true,
        dayMonthYear: true,
        startTime: true,
        endTime: true,
        resourceStatus: true,
        resourceId: false,
      },
    });

    try {
      loopThroughScheduledJobs(getAllRequestedJobs);
    } catch (error) {
      if (error instanceof CustomError) {
        console.log("catching the error in schedule-task");
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      }
      return NextResponse.json(
        { message: "Unknown error in task processing" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to check order status" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "updated orders" });
}
