import dayjs from 'dayjs';
import { productionOrder } from '@/lib/repositories';
import { CustomError } from '@/utils/CustomErrors';

// This helper function checks for time conflicts for a given resource and employee. If a conflict is found, it throws a CustomError.
export const checkTimeConflict = async (
  resourceId: number,
  dateScheduled: dayjs.Dayjs,
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
  assignedEmployeeId: string,
): Promise<void> => {
  // Fetch all existing production orders from the database to check for time conflicts.
  const existingOrdersDB = await productionOrder.findAll();
  // Filter the existing orders to only include those for the specified resource.
  const existingOrdersFromResource = existingOrdersDB.filter(
    (order) => order.resourceId === resourceId,
  );
  // Find any existing order that conflicts with the requested time slot for the same resource and employee.
  const conflictingOrder = existingOrdersFromResource.find((order) => {
    const existingStartTime = dayjs(order.startTime);
    const existingEndTime = dayjs(order.endTime);
    const existingDateScheduled = dayjs(order.dayMonthYear);
    // Check if the requested time slot overlaps with the existing order's time slot.
    return (
      dateScheduled.isSame(existingDateScheduled) &&
      ((startTime.isAfter(existingStartTime) && startTime.isBefore(existingEndTime)) ||
        (endTime.isAfter(existingStartTime) && endTime.isBefore(existingEndTime)) ||
        (startTime.isSame(existingStartTime) && endTime.isSame(existingEndTime))) &&
      order.employeeAssigneeID === assignedEmployeeId
    );
  });
  // If a conflicting order is found, throw an error to prevent scheduling the new order.
  if (conflictingOrder) {
    throw new CustomError(
      'Time slot conflicts with an existing order for this resource and employee. Select a different time slot or worker.',
      403,
    );
  }
};
