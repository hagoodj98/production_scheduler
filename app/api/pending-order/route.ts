import { NextRequest, NextResponse } from 'next/server';
import { CustomError } from '@/utils/CustomErrors';
import dayjs from 'dayjs';
import { markPendingRequestSchema } from '@/app/validation/productionOrderSchemas';
import { selectedResource, productionOrder } from '@/lib/repositories';
import { timeScheduleValidator } from '@/app/validation/timeScheduleValidator';
import PERMISSIONS from '@/utils/Permissions';

import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
//validating data before use
//This handler takes care of the pending state. This route is only called when the data is valid.
export async function POST(req: NextRequest) {
  try {
    await checkAuthMetaData(PERMISSIONS.assign?.name);

    const rawData = await req.json();
    if (!rawData) {
      throw new CustomError('Missing input information', 404);
    }
    const { order, existingOrder } = await markPendingRequestSchema.parseAsync(rawData);
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

    if (!existingOrder) {
      // Best practice: convert to JS Date when saving with Prisma
      const createdOrder = await productionOrder.create({
        dayMonthYear: date.toDate(), // Prisma DateTime
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        resourceId: retrievedId,
        resourceStatus: 'Pending',
      });

      return NextResponse.json(
        {
          message: 'succeed',
          orderId: createdOrder.id,
        },
        { status: 200 },
      );
    } else {
      const updatedOrder = await productionOrder.update(order.orderId!, {
        dayMonthYear: date.toDate(), // Prisma DateTime
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        resourceId: retrievedId,
        resourceStatus: 'Pending',
      });
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
