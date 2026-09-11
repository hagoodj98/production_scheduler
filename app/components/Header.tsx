'use client';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import AdminAccessForm from './AdminAccessForm';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';
const Header = ({ isAdminUserAuthenticated }: { isAdminUserAuthenticated: boolean }) => {
  const router = useRouter();
  const [showAdminAccessForm, setShowAdminAccessForm] = useState(false);

  const handleLoginClick = () => {
    // Logic to show the admin access form or trigger login
    setShowAdminAccessForm(true);
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleLogoutClick = async () => {
    await logout();
    handleMenuClose();
    router.push('/');
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="flex items-center justify-between mb-4 p-2">
      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>
      {isAdminUserAuthenticated ? (
        <>
          <Avatar className="text-[#FFBB28] text-2xl" onClick={handleMenuClick} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button onClick={handleLoginClick}>Login</Button>
      )}

      <AdminAccessForm
        open={showAdminAccessForm}
        redirectPath="/"
        onClose={() => setShowAdminAccessForm(false)}
      />
    </div>
  );
};

export default Header;
