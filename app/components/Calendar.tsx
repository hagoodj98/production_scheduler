'use client';
import React, { useCallback, useState, useReducer } from 'react';
import { OrderProps } from './types';
import fetcher from '../../utils/fetcher';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Notifier, { initialNotifierState, notifierReducer, Severity } from './ui/snackbar';
import { CalendarEvent } from './types';
import { API_ENDPOINTS } from '../config/api';
// Initialize the localizer for the calendar using dayjs
const localizer = dayjsLocalizer(dayjs);

const CalendarComponent = () => {
  const { data: fetchedData } = useSWR(API_ENDPOINTS.LOAD_ORDERS, fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });
  const [notifierState, notififierDispatcher] = useReducer(notifierReducer, initialNotifierState);
  const navigate = useRouter();

  const events = (fetchedData as { jobs: OrderProps[] })?.jobs?.flatMap((order) =>
    order.productionOrders.map((job) => ({
      title: `${order.resource_name} at ${dayjs(job.startTime).format('h:mm A')}`,
      start: dayjs(job.startTime).toDate(),
      end: dayjs(job.endTime).toDate(),
      resourceStatus: job.resourceStatus,
      resource_name: order.resource_name,
      resourceId: job.resourceId,
      id: job.id,
    })),
  );

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const [hover, setHover] = useState(false);

    const display = hover ? (
      <div className="flex mx-auto ">
        <button
          type="button"
          className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white px-2  rounded mr-2"
          onClick={() => {
            navigate.push(`/assign-order/${event.id}`);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="w-1/2 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-2  rounded"
          onClick={async () => {
            try {
              const response = await fetch(`${API_ENDPOINTS.DELETE_ORDER}?orderId=${event.id}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                const data = await response.json();
                notififierDispatcher({ type: 'setOpenNotifier', value: true });
                notififierDispatcher({ type: 'setNotifierMessage', value: data.error });
                notififierDispatcher({ type: 'setNotifierSeverity', value: Severity.error });
                return;
              }
              notififierDispatcher({
                type: 'setNotifierMessage',
                value: 'Order deleted successfully',
              });
              notififierDispatcher({ type: 'setOpenNotifier', value: true });
              notififierDispatcher({ type: 'setNotifierSeverity', value: Severity.success });
            } catch (error) {
              console.error('Error deleting order:', error);
              notififierDispatcher({ type: 'setNotifierMessage', value: 'Error deleting order' });
              notififierDispatcher({ type: 'setOpenNotifier', value: true });
              notififierDispatcher({ type: 'setNotifierSeverity', value: Severity.error });
            }
          }}
        >
          delete
        </button>
      </div>
    ) : (
      event.title
    );

    return (
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {display}
      </div>
    );
  };

  // Event styling: base color from status, but if a status is selected highlight matches and dim others
  const handleBackgroundColor = useCallback(() => {
    return (event: CalendarEvent) => {
      let backgroundColor;
      if (event.resourceStatus === 'Busy') {
        backgroundColor = '#ff4d4d';
      } else if (event.resourceStatus === 'Scheduled') {
        backgroundColor = '#007bff';
      } else if (event.resourceStatus === 'Completed') {
        backgroundColor = '#2ecc71';
      } else if (event.resourceStatus === 'Pending') {
        backgroundColor = '#f39c12';
      } else {
        backgroundColor = '#cccccc'; // Default color
      }

      const style: React.CSSProperties = {
        backgroundColor,
        borderRadius: '4px',
        color: '#fff',
        transition: 'opacity 200ms ease, box-shadow 200ms ease, transform 150ms ease',
      };

      return {
        style,
      };
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 220px)', fontSize: 10, width: '100%' }}
        eventPropGetter={handleBackgroundColor()}
        components={{ event: EventComponent }}
      />
      <Notifier
        open={notifierState.openNotifier}
        onClose={() => notififierDispatcher({ type: 'setOpenNotifier', value: false })}
        severity={notifierState.notifierSeverity}
        message={notifierState.notifierMessage}
      />
    </div>
  );
};

export default CalendarComponent;
