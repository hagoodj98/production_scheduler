'use client';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAuthenticatedAdminUserContext } from '../context';

const LockBox = () => {
  const { userIsAuthenticated } = useAuthenticatedAdminUserContext();
  return (
    <div
      className={`flex items-center justify-center border w-1/3  ${userIsAuthenticated.isAuthenticated ? 'border-green-700' : 'border-red-700'} p-2`}
    >
      <h3
        className={`text-sm font-bold  ${userIsAuthenticated.isAuthenticated ? 'text-green-700' : 'text-red-700'}`}
      >
        {userIsAuthenticated.isAuthenticated ? 'Unlocked' : 'Locked'}
      </h3>
      {userIsAuthenticated.isAuthenticated ? (
        <LockOpenIcon color="success" />
      ) : (
        <LockIcon color="error" />
      )}
    </div>
  );
};

export default LockBox;
