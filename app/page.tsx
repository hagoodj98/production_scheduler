import Recharts from './components/Recharts';
import NavButton from './components/NavButton';
import Calendar from './components/Calendar';
import Header from './components/Header';

export default async function Home() {
  return (
    <div>
      {/* Header */}
      <Header />
      <div className="p-6 top-0 z-20  bg-white py-4 flex justify-around  gap-4">
        <div className="flex ml-1 mr-1 w-1/3 md:ml-4 md:mr-4">
          <Recharts compact />
        </div>
        <div className=" flex items-center  gap-2">
          <NavButton pageNav="/add-resource" resourceLabel="Add Resource" />
          <NavButton pageNav="/assign-order" resourceLabel="Create Order" />
          <NavButton pageNav="/order-log" resourceLabel="Order Log" />
        </div>
      </div>

      {/* Main layout */}
      <main className="md:col-span-9">
        <div>
          <div className="bg-white p-4 rounded shadow-sm min-h-[60vh]">
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  );
}
