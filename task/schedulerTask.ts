//This file serves as the brain that checks the time and make the status changes
import { RequestScheduledJobs } from '@/app/components/types';
import { prisma } from '@/lib/database';
import { CustomError } from '@/utils/CustomErrors';
import dayjs from 'dayjs';
import { STATUSES } from '@/utils/GlobalVar';

export const updateOrderStatuses = async (ordersArray: RequestScheduledJobs[]): Promise<void> => {
  try {
    if (!ordersArray) {
      throw new CustomError('Cannot find array or array is empty', 404);
    }

    await Promise.all(ordersArray.map((order) => changeStatus(order)));
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('There was a problem looping through the array', 500);
  }
};
//This function is called for every job with a Scheduled Status inside the pendingJobs array I created. I want the job object and the slotKey from the loopThroughPendingJobs function. SlotKey is a string that I can parse and use to compare timing. If the current time is before or after the slotKeys, then change the statuses according.
async function changeStatus(order: RequestScheduledJobs) {
  try {
    if (!order) {
      throw new CustomError('Missing information to process the times for status changes', 404);
    }

    const startTime = dayjs(order.startTime); //In order to compare start and end times, I used a function that would convert the military time(string) into an actual date object
    const endTime = dayjs(order.endTime);
    const now = dayjs();

    const isPending = await prisma.productionOrder.findUniqueOrThrow({
      where: {
        id: order.id,
      },
      select: {
        resourceStatus: true,
      },
    });

    if (isPending.resourceStatus === STATUSES.pending) {
      return;
    }

    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      await prisma.productionOrder.update({
        where: {
          id: order.id,
        },
        data: {
          resourceStatus: STATUSES.busy,
        },
      });
    } else if (now.isBefore(startTime)) {
      await prisma.productionOrder.update({
        where: {
          id: order.id,
        },
        data: {
          resourceStatus: STATUSES.scheduled,
        },
      });
    } else {
      await prisma.productionOrder.update({
        where: {
          id: order.id,
        },
        data: {
          resourceStatus: STATUSES.completed,
        },
      });
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('There was a problem processing the current time or time slot', 500);
  }
}
export const parseTime = (time: string): Date => {
  const date = dayjs(time, 'HH:mm');
  if (!date.isValid()) {
    throw new CustomError('Invalid time format', 400);
  }
  return date.toDate();
};
