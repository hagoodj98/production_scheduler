import Recharts from "./components/Recharts";
import NavButton from "./components/NavButton";
import Calendar from "./components/Calendar";

export default async function Home() {
  // Load resources and production orders on the server

  return (
    <div className="p-6">
      {/* Header */}

      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>

      <div className=" top-0 z-20  bg-white py-4 flex justify-center  gap-4">
        <div className="hidden md:flex ml-4 mr-4">
          <Recharts compact />
        </div>
        <div className=" flex items-center gap-3">
          <a
            href="/add-resource"
            className="rounded bg-yellow-400 text-black px-3 py-2 text-sm hover:bg-yellow-500"
          >
            + Add Resource
          </a>
          <NavButton pageNav="/assign-resource" resourceLabel="Create Order" />
        </div>
      </div>

      {/* Main layout */}
      <div>
        <main className="md:col-span-9">
          <div className="bg-white p-4 rounded shadow-sm min-h-[60vh]">
            <Calendar />
          </div>
        </main>
      </div>
    </div>
  );
}
