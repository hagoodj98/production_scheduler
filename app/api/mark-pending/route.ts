import { NextRequest, NextResponse } from "next/server";
import { CustomError } from "@/utils/CustomErrors";
import dayjs from "dayjs";
import { prisma } from "@/lib/database";
import z from "zod/v4";
import { markPendingRequestSchema } from "@/app/validation/productionOrderSchemas";

//validating data before use
//This handler takes care of the pending state. This route is only called when the data is valid.
export async function POST(req: NextRequest) {
  try {
    if (!req) {
      throw new CustomError("Missing input information", 404);
    }

    const rawData = await req.json();
    const { order, existingOrder } =
      await markPendingRequestSchema.parseAsync(rawData);
    //Getting data out of rawData so we can push clean and clarified data to database
    const year = order.dayMonthYear.year;
    const month = order.dayMonthYear.month;
    const day = order.dayMonthYear.day;
    const startHour = order.timeRange.startTimeSlot.hour;
    const startMinute = order.timeRange.startTimeSlot.minute;
    const endHour = order.timeRange.endTimeSlot.hour;
    const endMinute = order.timeRange.endTimeSlot.minute;
    const resourceName = order.resource.resource_name;
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

    if (!existingOrder) {
      // Best practice: convert to JS Date when saving with Prisma
      const createdOrder = await prisma.productionOrder.create({
        data: {
          dayMonthYear: date.toDate(), // Prisma DateTime
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
          resourceId: retrievedId,
          resourceStatus: "Pending",
        },
      });

      return NextResponse.json(
        {
          message: "succeed",
          orderId: createdOrder.id,
        },
        { status: 200 },
      );
    } else {
      //updating existing order
      // Log received payload to aid debugging
      console.debug("mark-pending update received:", { order: order });

      const updatedOrder = await prisma.productionOrder.update({
        where: {
          id: order.orderId!,
        },
        data: {
          dayMonthYear: date.toDate(), // Prisma DateTime
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
          resourceId: retrievedId,
          resourceStatus: "Pending",
        },
      });
      return NextResponse.json(
        {
          message: "succeed",
          orderId: updatedOrder.id,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      console.log(error.issues);

      return NextResponse.json(
        { error: error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "There was an internal error. Try again later" },
      { status: 500 },
    );
  }
}
