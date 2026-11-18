import React from 'react';
import Notifier from './ui/snackbar';
import { useNotifierContext } from '../context';

const CalendarNotifier = () => {
  const { eventComponentNotifier, setEventComponentNotifier } = useNotifierContext();

  return (
    <Notifier
      open={eventComponentNotifier?.open ?? false}
      onClose={() =>
        // Keep message/severity so the snackbar doesn't flash empty while closing
        setEventComponentNotifier((prev) => (prev ? { ...prev, open: false } : null))
      }
      severity={eventComponentNotifier?.severity}
      message={eventComponentNotifier?.message ?? ''}
    />
  );
};
export default CalendarNotifier;
