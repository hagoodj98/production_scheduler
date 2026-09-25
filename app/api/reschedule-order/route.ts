import { NextResponse, NextRequest } from 'next/server';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
import PERMISSIONS from '@/utils/Permissions';
import { productionOrder } from '@/lib/repositories/productionOrder';
import { productionOrderSchema } from '@/app/validation/productionOrderSchemas';
import dayjs from 'dayjs';
import { timeScheduleValidator } from '@/app/validation/timeScheduleValidator';
import { selectedResource } from '@/lib/repositories/selectedResource';
export async function PATCH(req: NextRequest) {
  try {
    //First check if the user has the required permission to reschedule orders before processing data
    await checkAuthMetaData(PERMISSIONS.reschedule?.name);

    const rawData = await req.json();
    const order = productionOrderSchema.parse(rawData.productionOrder ?? rawData.order);
    // Check if the user has the required permission to reschedule orders
    const orderId = order.orderId;
    console.log('Order ID:', orderId);
    if (!orderId) return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });

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
      [year, month, day, startHour, startMinute, endHour, endMinute, resourceName].some(
        (v) => v === null || v === undefined || v === '',
      )
    ) {
      return NextResponse.json({ message: 'Incomplete order payload' }, { status: 400 });
    }

    // validating the times with the timeScheduleValidator function I created. This will throw an error if the times are not valid and the catch block will handle it.
    timeScheduleValidator(order.dayMonthYear, order.timeRange);
    const startTime = dayjs(
      `${year}-${month}-${day} ${startHour}:${startMinute}:00`,
      'YYYY-M-D HH:mm:ss',
    );
    const endTime = dayjs(
      `${year}-${month}-${day} ${endHour}:${endMinute}:00`,
      'YYYY-M-D HH:mm:ss',
    );
    const date = dayjs(`${year}-${month}-${day}`);

    // Perform your rescheduling logic here, e.g., update the order in the database
    // Update the pending order that was created by mark-pending
    const getIdOfSelectedResource = await selectedResource.findByNameOrThrow(resourceName);
    if (!getIdOfSelectedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    await productionOrder.update(orderId, {
      dayMonthYear: date.toDate(),
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      resourceId: getIdOfSelectedResource.id,
      resourceStatus: 'Processing',
    });
    return NextResponse.json(
      {
        message: `Updated order ${orderId} to Processing status`,
        orderId: orderId,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }

  // Perform your update logic here, e.g., update the order in the database
}
