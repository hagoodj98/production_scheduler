"use client";

import React, { useEffect, useState } from "react";
import { Resource } from "./types";
import Legend from "./Legend";
import { useResourcesContext } from "../context";

interface Props {
  resources: Resource[];
}

const ResourcesSidebar: React.FC<Props> = ({ resources }) => {
  const { setResourceData, selectedResourceIds, setSelectedResourceIds } =
    useResourcesContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Initialize context when sidebar mounts
    if (resources && resources.length > 0) {
      setResourceData(resources);
      // If not already set, select all by default
      if (!selectedResourceIds || selectedResourceIds.length === 0) {
        setSelectedResourceIds(resources.map((r) => r.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  const toggle = () => setOpen((s) => !s);

  const selectAll = () => setSelectedResourceIds(resources.map((r) => r.id));
  const clearAll = () => setSelectedResourceIds([]);

  const onChange = (id: number) => {
    if (selectedResourceIds.includes(id)) {
      setSelectedResourceIds(selectedResourceIds.filter((x) => x !== id));
    } else {
      setSelectedResourceIds([...selectedResourceIds, id]);
    }
  };

  return (
    <>
      {/* Floating button for mobile to open the drawer */}
      <button
        className="md:hidden fixed bottom-6 left-6 z-40 bg-blue-600 text-white px-3 py-2 rounded shadow-lg"
        onClick={toggle}
        aria-expanded={open}
      >
        Filters
      </button>

      {/* Drawer for small screens */}
      <div
        className={`md:hidden fixed inset-0 z-30 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-80 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between md:hidden">
            <h3 className="font-semibold">Filters</h3>
            <div className="flex gap-2 items-center">
              <button
                className="text-sm px-2 py-1 rounded bg-gray-100"
                onClick={selectAll}
              >
                Select all
              </button>
              <button
                className="text-sm px-2 py-1 rounded bg-gray-100"
                onClick={clearAll}
              >
                Clear
              </button>
              <button
                className="text-gray-500 ml-2"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:justify-between md:mb-3">
            <h3 className="font-semibold">Resources</h3>
            <div className="flex gap-2">
              <button
                className="text-sm px-2 py-1 rounded bg-gray-100"
                onClick={selectAll}
              >
                Select all
              </button>
              <button
                className="text-sm px-2 py-1 rounded bg-gray-100"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="space-y-2 mt-2">
            {resources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedResourceIds.includes(r.id)}
                    onChange={() => onChange(r.id)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm font-medium no-underline select-none">
                    {r.resource_name}
                  </span>
                </label>
                <span className="w-3 h-3 rounded-full bg-gray-400" />
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Status</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Pending
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Scheduled
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Busy
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Completed
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Filters</h4>
            <div className="flex flex-col gap-2">
              <select className="border p-2 rounded text-sm">
                <option>Resource</option>
              </select>
              <select className="border p-2 rounded text-sm">
                <option>Status</option>
              </select>
              <input
                className="border p-2 rounded text-sm"
                placeholder="Search orders…"
              />
            </div>
          </div>

          <div className="mt-6">
            <Legend />
          </div>
        </aside>
      </div>

      {/* Desktop permanent sidebar placeholder: shows in place of original aside on md+ */}
      <div className="hidden md:block md:col-span-3">
        <aside className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-2">
            {resources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedResourceIds.includes(r.id)}
                    onChange={() => onChange(r.id)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm font-medium">{r.resource_name}</span>
                </label>
                <span className="w-3 h-3 rounded-full bg-gray-400" />
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Filters</h4>
            <div className="flex flex-col gap-2">
              <select className="border p-2 rounded text-sm">
                <option>Resource</option>
              </select>
              <select className="border p-2 rounded text-sm">
                <option>Status</option>
              </select>
              <input
                className="border p-2 rounded text-sm"
                placeholder="Search orders…"
              />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default ResourcesSidebar;
