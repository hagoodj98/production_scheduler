import Recharts from './components/Recharts';
import NavButton from './components/NavButton';
import Calendar from './components/Calendar';
import LockBox from './components/lockBox';

import Header from './components/Header';
import { CheckAuth } from './components/CookieLookUp';
export default async function Home() {
  // Check if the admin user is authenticated
  const isAdminUserAuthenticated = await CheckAuth();

  return (
    <div className="p-6">
      {/* Header */}
      <Header isAdminUserAuthenticated={isAdminUserAuthenticated} />
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
            <Calendar isAdminUserAuthenticated={isAdminUserAuthenticated} />
          </div>
        </div>
      </main>
    </div>
  );
}
