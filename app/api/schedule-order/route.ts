import { NextRequest, NextResponse } from 'next/server';
import { productionOrderSchema } from '@/app/validation/productionOrderSchemas';
import { selectedResource, productionOrder } from '@/lib/repositories';
import dayjs from 'dayjs';
import { timeScheduleValidator } from '@/app/validation/timeScheduleValidator';

export async function POST(req: NextRequest) {
  const rawData = await req.json();
  const order = productionOrderSchema.parse(rawData.productionOrder ?? rawData.order);
  const orderId = order.orderId; // Get the pending order ID
  if (!order || orderId === null || orderId === undefined) {
    return NextResponse.json({ message: 'Missing order payload' }, { status: 400 });
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
  const endTime = dayjs(`${year}-${month}-${day} ${endHour}:${endMinute}:00`, 'YYYY-M-D HH:mm:ss');
  const date = dayjs(`${year}-${month}-${day}`);
  const getIdOfSelectedResource = await selectedResource.findByNameOrThrow(resourceName);
  const retrievedId = getIdOfSelectedResource.id;

  // Fallback: create new order if no pending order exists
  const createdOrder = await productionOrder.update(orderId, {
    dayMonthYear: date.toDate(),
    startTime: startTime.toDate(),
    endTime: endTime.toDate(),
    resourceId: retrievedId,
    resourceStatus: 'Processing',
  });
  return NextResponse.json(
    {
      message: `Created new order ${createdOrder.id}`,
      orderId: createdOrder.id,
    },
    { status: 200 },
  );
}
