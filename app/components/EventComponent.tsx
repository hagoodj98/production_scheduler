import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarEvent } from './types';
import { API_ENDPOINTS } from '../config/api';
import { Severity } from './ui/snackbar';
import { useNotifierContext } from '../context';

//this component needs context for the notifier to display messages when actions like delete succeed or fail, instead of managing its own local notifier state
const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const [hover, setHover] = useState(false);

  const { setEventComponentNotifier } = useNotifierContext();
  const navigate = useRouter();
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
              setEventComponentNotifier({
                open: true,
                message: data.error,
                severity: Severity.error,
              });
              return;
            }
            setEventComponentNotifier({
              open: true,
              message: 'Order deleted successfully',
              severity: Severity.success,
            });
          } catch (error) {
            console.error('Error deleting order:', error);
            setEventComponentNotifier({
              open: true,
              message: 'Error deleting order',
              severity: Severity.error,
            });
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

export default EventComponent;
