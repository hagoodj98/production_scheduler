import Recharts from './components/Recharts';
import NavButton from './components/NavButton';
import Calendar from './components/Calendar';
import LockIcon from '@mui/icons-material/Lock';

export default async function Home() {
  // Load resources and production orders on the server
  // eslint-disable-next-line prefer-const
  let adminAccessGranted = false; // Replace with actual access control logic

  return (
    <div className="p-6">
      {/* Header */}

      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>

      <div className=" top-0 z-20  bg-white py-4 flex  gap-4">
        <div className="flex items-center justify-center border w-1/3 border-red-700 p-2">
          <h3 className="text-sm font-bold text-red-700">Admin Access Only</h3>
          <div className="text-red-700 text-sm">
            <LockIcon />
          </div>
        </div>
        <div className="flex ml-1 mr-1 w-1/3 md:ml-4 md:mr-4">
          <Recharts compact />
        </div>
        <div className=" flex items-center w-1/3 gap-3">
          <NavButton adminAccess={adminAccessGranted} resourceLabel="Add Resource" />
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
