"use client";
import React, { useCallback, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useResourcesContext } from "../context";
import Notifier, { Severity } from "./Notifier";

const localizer = dayjsLocalizer(dayjs);

interface OrderProps {
  id: number;
  resource_name: string;
  productionOrders: {
    id: number;
    dayMonthYear: Date;
    startTime: Date;
    endTime: Date;
    resourceStatus: string;
    resourceId: number;
  }[];
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceStatus: string;
  resource_name?: string;
  resourceId?: number;
  [key: string]: unknown;
}

const MyCalendar: React.FC = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
    return await res.json();
  };
  const { data: fetchedData } = useSWR<{
    ResourceProductionOrders: OrderProps[];
  }>("/api/load-jobs-to-chart", fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });

  const { selectedResourceIds, selectedStatus } = useResourcesContext();
  const [openNotifier, setOpenNotifier] = useState(false);
  const navigate = useRouter();
  const [notifierSeverity, setNotifierSeverity] = useState<Severity>();
  const [notifierMessage, setNotifierMessage] = useState("");
  const events = fetchedData?.ResourceProductionOrders.flatMap((order) =>
    order.productionOrders.map((job) => ({
      title: `${order.resource_name} at ${dayjs(job.startTime).format("h:mm A")}`,
      start: dayjs(job.startTime).toDate(),
      end: dayjs(job.endTime).toDate(),
      resourceStatus: job.resourceStatus,
      resource_name: order.resource_name,
      resourceId: job.resourceId,
      id: job.id,
    })),
  )?.filter((e) => {
    // Only filter by resource selection; status selection will highlight instead of filtering
    if (
      selectedResourceIds &&
      selectedResourceIds.length > 0 &&
      !selectedResourceIds.includes(e.resourceId as number)
    )
      return false;
    return true;
  });

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const [hover, setHover] = useState(false);

    const display = hover ? (
      <div className="flex mx-auto ">
        <button
          type="button"
          className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white px-2  rounded mr-2"
          onClick={async () => {
            if (
              !(
                event.resourceStatus === "Busy" ||
                event.resourceStatus === "Completed" ||
                event.resourceStatus === "Scheduled"
              )
            ) {
              navigate.push(`/assign-resource/${event.id}`);
            } else {
              setNotifierMessage(
                "Busy/Completed/Scheduled orders cannot be edited",
              );
              setOpenNotifier(true);
              setNotifierSeverity("warning");
            }
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="w-1/2 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-2  rounded"
          onClick={async () => {
            if (
              !(
                event.resourceStatus === "Busy" ||
                event.resourceStatus === "Completed" ||
                event.resourceStatus === "Scheduled"
              )
            ) {
              try {
                await fetch("/api/delete-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ orderId: event.id }),
                });
                setNotifierMessage("Order deleted successfully");
                setOpenNotifier(true);
              } catch (error) {
                console.error("Error deleting order:", error);
                setNotifierMessage("Error deleting order");
                setOpenNotifier(true);
              }
            } else {
              setNotifierMessage(
                "Busy/Completed/Scheduled orders cannot be deleted",
              );
              setOpenNotifier(true);
              setNotifierSeverity("warning");
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
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {display}
      </div>
    );
  };

  // Event styling: base color from status, but if a status is selected highlight matches and dim others
  const handleBackgroundColor = useCallback(() => {
    return (event: CalendarEvent) => {
      let backgroundColor;
      if (event.resourceStatus === "Busy") {
        backgroundColor = "#ff4d4d";
      } else if (event.resourceStatus === "Scheduled") {
        backgroundColor = "#007bff";
      } else if (event.resourceStatus === "Completed") {
        backgroundColor = "#2ecc71";
      } else if (event.resourceStatus === "Pending") {
        backgroundColor = "#f39c12";
      } else {
        backgroundColor = "#cccccc"; // Default color
      }

      const style: React.CSSProperties = {
        backgroundColor,
        borderRadius: "4px",
        color: "#fff",
        transition:
          "opacity 200ms ease, box-shadow 200ms ease, transform 150ms ease",
      };

      if (selectedStatus) {
        if (event.resourceStatus === selectedStatus) {
          style.boxShadow = "0 0 0 3px rgba(0,0,0,0.12)";
          style.opacity = 1;
          style.transform = "scale(1.02)";
        } else {
          style.opacity = 0.25;
          style.transform = "none";
          style.boxShadow = "none";
        }
      } else {
        style.opacity = 1;
        style.transform = "none";
      }

      return {
        style,
      };
    };
  }, [selectedStatus]);

  return (
    <div className="w-full h-full">
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 220px)", fontSize: 10, width: "100%" }}
        eventPropGetter={handleBackgroundColor()}
        components={{ event: EventComponent }}
      />
      <Notifier
        open={openNotifier}
        onClose={() => setOpenNotifier(false)}
        severity={notifierSeverity}
        message={notifierMessage}
      />
    </div>
  );
};

export default MyCalendar;
