import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import dayjs from "dayjs";
import { productionOrderSchema } from "@/app/validation/productionOrderSchemas";

export async function POST(req: NextRequest) {
  const rawData = await req.json();
  const order = productionOrderSchema.parse(
    rawData.productionOrder ?? rawData.order,
  );
  const orderId = order?.orderId; // Get the pending order ID

  if (!order) {
    return NextResponse.json(
      { message: "Missing order payload" },
      { status: 400 },
    );
  }

  // Getting data out of order so we can push clean and clarified data to database
  const year = order.dayMonthYear?.year;
  const month = order.dayMonthYear?.month;
  const day = order.dayMonthYear?.day;
  const startHour = order.timeRange?.startTimeSlot?.hour;
  const startMinute = order.timeRange?.startTimeSlot?.minute;
  const endHour = order.timeRange?.endTimeSlot?.hour;
  const endMinute = order.timeRange?.endTimeSlot?.minute;
  const resourceName = order.resource?.resource_name;

  if (
    [
      year,
      month,
      day,
      startHour,
      startMinute,
      endHour,
      endMinute,
      resourceName,
    ].some((v) => v === null || v === undefined || v === "")
  ) {
    return NextResponse.json(
      { message: "Incomplete order payload" },
      { status: 400 },
    );
  }
  const startTime = dayjs(
    `${year}-${month}-${day} ${startHour}:${startMinute}:00`,
    "YYYY-M-D HH:mm:ss",
  );
  const endTime = dayjs(
    `${year}-${month}-${day} ${endHour}:${endMinute}:00`,
    "YYYY-M-D HH:mm:ss",
  );
  const date = dayjs(`${year}-${month}-${day}`);
  //Get ID of resource from the SelectedResource database we can along with the rest of the production order
  const getIdOfSelectedResource =
    await prisma.selectedResource.findFirstOrThrow({
      where: {
        resource_name: resourceName,
      },
    });
  const retrievedId = getIdOfSelectedResource.id;

  try {
    // If orderId exists, update the pending order to Processing. Otherwise create a new one.
    if (orderId) {
      // Update the pending order that was created by mark-pending
      await prisma.productionOrder.update({
        where: {
          id: orderId,
        },
        data: {
          dayMonthYear: date.toDate(),
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
          resourceId: retrievedId,
          resourceStatus: "Processing",
        },
      });
      return NextResponse.json(
        {
          message: `Updated order ${orderId} to Processing status`,
          orderId: orderId,
        },
        { status: 200 },
      );
    } else {
      // Fallback: create new order if no pending order exists
      const createdOrder = await prisma.productionOrder.create({
        data: {
          dayMonthYear: date.toDate(),
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
          resourceId: retrievedId,
          resourceStatus: "Processing",
        },
      });
      return NextResponse.json(
        {
          message: `Created new order ${createdOrder.id}`,
          orderId: createdOrder.id,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Failed to process order" },
      { status: 500 },
    );
  }
}
