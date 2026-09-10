'use client';
import LockIcon from '@mui/icons-material/Lock';
import { useAuthenticatedAdminUser } from '../context';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const LockBox = ({ isAdminUserAuthenticated }: { isAdminUserAuthenticated: boolean }) => {
  return (
    <div
      className={`flex items-center justify-center border w-1/3 ${isAdminUserAuthenticated ? 'border-green-700' : 'border-red-700'} p-2`}
    >
      <h3
        className={`text-sm font-bold ${isAdminUserAuthenticated ? 'text-green-700' : 'text-red-700'}`}
      >
        {isAdminUserAuthenticated ? 'Admin Granted' : 'Admin Access Only'}
      </h3>
      {isAdminUserAuthenticated ? <LockOpenIcon color="success" /> : <LockIcon color="error" />}
    </div>
  );
};

export default LockBox;
