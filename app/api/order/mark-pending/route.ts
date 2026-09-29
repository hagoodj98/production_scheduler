import { NextRequest, NextResponse } from 'next/server';
import { CustomError } from '@/utils/CustomErrors';
import dayjs from 'dayjs';
import { markPendingRequestSchema } from '@/app/validation/productionOrderSchemas';
import { selectedResource, productionOrder } from '@/lib/repositories';
import { timeScheduleValidator } from '@/app/validation/timeScheduleValidator';
import PERMISSIONS from '@/utils/Permissions';

import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
// Validating data before use
// This handler takes care of the pending state. This route is only called when the data is valid.
export async function POST(req: NextRequest) {
  try {
    // Check if the user has the necessary permission to assign a production order
    await checkAuthMetaData(PERMISSIONS.assign?.name);

    const rawData = await req.json();
    if (!rawData) {
      throw new CustomError('Missing input information', 404);
    }
    // Parse and validate the incoming request data against the schema
    const { order, existingOrder } = await markPendingRequestSchema.parseAsync(rawData);
    if (!order || order.orderId === undefined || order.orderId === null) {
      throw new CustomError('Invalid order data', 404);
    }
    // Getting data out of rawData so we can push clean and clarified data to database
    const year = order.dayMonthYear.year;
    const month = order.dayMonthYear.month;
    const day = order.dayMonthYear.day;
    const startHour = order.timeRange.startTimeSlot.hour;
    const startMinute = order.timeRange.startTimeSlot.minute;
    const endHour = order.timeRange.endTimeSlot.hour;
    const endMinute = order.timeRange.endTimeSlot.minute;
    const resourceName = order.resource.resource_name;
    const assignedEmployeeId = order.assignedEmployeeId;

    const startTime = dayjs(
      `${year}-${month}-${day} ${startHour}:${startMinute}:00`,
      'YYYY-M-D HH:mm:ss',
    );
    const endTime = dayjs(
      `${year}-${month}-${day} ${endHour}:${endMinute}:00`,
      'YYYY-M-D HH:mm:ss',
    );
    const date = dayjs(`${year}-${month}-${day}`);
    //validating the times with the timeScheduleValidator function I created. This will throw an error if the times are not valid and the catch block will handle it.
    timeScheduleValidator(order.dayMonthYear, order.timeRange);
    //Get ID of resource from the SelectedResource database we can along with the rest of the production order
    const getIdOfSelectedResource = await selectedResource.findByNameOrThrow(resourceName);
    const retrievedId = getIdOfSelectedResource.id;

    // At this point, we have all the necessary information to either create a new production order or update an existing one
    if (!existingOrder) {
      // Best practice: convert to JS Date when saving with Prisma
      const createdOrder = await productionOrder.create({
        dayMonthYear: date.toDate(), // Prisma DateTime
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        resourceId: retrievedId,
        resourceStatus: 'Pending',
        employeeAssigneeID: assignedEmployeeId,
      });
      // Return a success response with the ID of the newly created order
      return NextResponse.json(
        {
          message: 'succeed',
          orderId: createdOrder.id,
        },
        { status: 200 },
      );
    } else {
      // If an existing order is provided, update it with the new details
      const updatedOrder = await productionOrder.update(order.orderId, {
        dayMonthYear: date.toDate(), // Prisma DateTime
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        resourceId: retrievedId,
        resourceStatus: 'Pending',
        employeeAssigneeID: assignedEmployeeId,
      });
      // Return a success response with the ID of the updated order
      return NextResponse.json(
        {
          message: 'succeed',
          orderId: updatedOrder.id,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return handleError(error);
  }
}
