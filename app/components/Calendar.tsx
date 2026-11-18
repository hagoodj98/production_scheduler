'use client';
import React from 'react';
import CalendarNotifier from './CalendarNotifier';
import EventComponent from './EventComponent';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import { CalendarEvent } from './types';
import isEqual from 'lodash/isEqual';
import { STATUS_COLORS } from '@/utils/GlobalVar';

// Initialize the localizer for the calendar using dayjs
const localizer = dayjsLocalizer(dayjs);

const CALENDAR_STYLE = { height: 'calc(100vh - 220px)', fontSize: 10, width: '100%' };
// Event styling: base color from status, but if a status is selected highlight matches and dim others
const eventPropGetter = (event: CalendarEvent) => ({
  style: {
    backgroundColor: STATUS_COLORS[event.resourceStatus] ?? '#cccccc',
    borderRadius: '4px',
    color: '#fff',
    transition: 'opacity 200ms ease, box-shadow 200ms ease, transform 150ms ease',
  } as React.CSSProperties,
});
// Calendar components configuration, currently only customizing the event component
const CALENDAR_COMPONENTS = { event: EventComponent };
const CalendarComponent = React.memo(
  ({ events }: { events: CalendarEvent[] | undefined }) => {
    return (
      <div className="w-full h-full">
        <Calendar
          events={events}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={CALENDAR_STYLE}
          eventPropGetter={eventPropGetter}
          components={CALENDAR_COMPONENTS}
        />
        {/* Let notifier be in its own component, so that this calendar components does not consume context, causing calendar to rerender unnecessarily */}
        <CalendarNotifier />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 1. If both are undefined/null or point to the exact same reference, skip render
    if (prevProps.events === nextProps.events) return true;

    // 2. If one of them suddenly disappeared or lengths mismatch, force render
    if (!prevProps.events || !nextProps.events) return false;
    if (prevProps.events.length !== nextProps.events.length) return false;

    // 3. Do a deep structural comparison of the array elements
    // This shields your calendar from SWR's new references completely
    return isEqual(prevProps.events, nextProps.events);
  },
);

CalendarComponent.displayName = 'CalendarComponent';
export default CalendarComponent;
