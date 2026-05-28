import dayjs from 'dayjs';
import { CustomError } from '@/utils/CustomErrors';
import { DayMonthYear, TimeRange } from '../components/types';
// This function validates the start and end times of a production order. It checks if the start time is in the future and if the end time is after the start time. If any of these conditions are not met, it throws a CustomError with an appropriate message and status code.
export const timeScheduleValidator = (dayMonthYear: DayMonthYear, timeRange: TimeRange) => {
  try {
    
    const startDateTime = dayjs()
      .year(dayMonthYear.year || 0)
      .month((dayMonthYear.month || 1) - 1)
      .date(dayMonthYear.day || 1)
      .hour(timeRange.startTimeSlot.hour || 0)
      .minute(timeRange.startTimeSlot.minute || 0);
    const endDateTime = dayjs()
      .year(dayMonthYear.year || 0)
      .month((dayMonthYear.month || 1) - 1)
      .date(dayMonthYear.day || 1)
      .hour(timeRange.endTimeSlot.hour || 0)
      .minute(timeRange.endTimeSlot.minute || 0);
    const now = dayjs();

    if (startDateTime.isBefore(now)) {
      throw new CustomError('Start time must be in the future', 400);
    }
    if (endDateTime.isBefore(startDateTime)) {
      throw new CustomError('End time must be after start time', 400);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('There was a problem processing the current time or time slot', 500);
  }
};
