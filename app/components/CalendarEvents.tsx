'use client';
import fetcher from '@/utils/fetcher';
import useSWR from 'swr';
import { API_ENDPOINTS } from '../config/api';
import { OrderProps } from './types';
import dayjs from 'dayjs';
import CalendarComponent from './Calendar';
import { useMemo } from 'react';

const convertToDate = (dateString: Date) => dayjs(dateString).toDate();

const CalendarEvents = () => {
  const { data: fetchedData } = useSWR(API_ENDPOINTS.LOAD_ORDERS, fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });

  const events = useMemo(() => {
    return (
      (fetchedData as { jobs: OrderProps[] } | undefined)?.jobs?.flatMap((order) =>
        order.productionOrders.map((job) => ({
          title: `${order.resource_name} at ${dayjs(job.startTime).format('h:mm A')}`,
          start: convertToDate(job.startTime),
          end: convertToDate(job.endTime),
          resourceStatus: job.resourceStatus,
          resource_name: order.resource_name,
          resourceId: job.resourceId,
          id: job.id,
        })),
      ) ?? []
    );
  }, [fetchedData]);

  // Map fetched data to calendar events format
  return <CalendarComponent events={events} />;
};

export default CalendarEvents;
