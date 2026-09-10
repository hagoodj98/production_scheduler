import Recharts from './components/Recharts';
import NavButton from './components/NavButton';
import Calendar from './components/Calendar';
import LockBox from './components/lockBox';
import { cookies } from 'next/headers';
export default async function Home() {
  const cookieStore = await cookies();
  const isAdminUserAuthenticated = cookieStore.get('session') ? true : false;

  return (
    <div className="p-6">
      {/* Header */}

      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>

      <div className=" top-0 z-20  bg-white py-4 flex  gap-4">
        <LockBox isAdminUserAuthenticated={isAdminUserAuthenticated} />
        <div className="flex ml-1 mr-1 w-1/3 md:ml-4 md:mr-4">
          <Recharts compact />
        </div>
        <div className=" flex items-center w-1/3 gap-3">
          <NavButton
            isAdminUserAuthenticated={isAdminUserAuthenticated}
            pageNav="/add-resource"
            resourceLabel="Add Resource"
          />
          <NavButton
            isAdminUserAuthenticated={isAdminUserAuthenticated}
            pageNav="/assign-resource"
            resourceLabel="Create Order"
          />
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
