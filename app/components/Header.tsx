'use client';
import { useState, useReducer } from 'react';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';
import AdminAccessForm from './AdminAccessForm';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { useAuthenticatedAdminUserContext } from '../context';
import Tooltip from '@mui/material/Tooltip';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
const Header = () => {
  const router = useRouter();
  const { userIsAuthenticated, setUserIsAuthenticated } = useAuthenticatedAdminUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showAdminAccessForm, setShowAdminAccessForm] = useState(false);

  const handleLoginClick = () => {
    // Logic to show the admin access form or trigger login
    setShowAdminAccessForm(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleLogoutClick = async () => {
    await logout();
    setUserIsAuthenticated({
      state: 'unauthenticated',
      name: '',
    });
    handleMenuClose();
    // router.push('/');
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="flex items-center justify-between bg-black p-2">
      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>
      {userIsAuthenticated.state === 'authenticated' ? (
        <div className="flex gap-2">
          <div className="flex items-center ">
            <h5 className="text-[#FFBB28] text-sm">Hello, {userIsAuthenticated.name}</h5>
            <Tooltip
              title={
                userIsAuthenticated.state === 'authenticated' ? 'granted access' : 'access denied'
              }
            >
              {userIsAuthenticated.state === 'authenticated' ? (
                <LockOpenIcon color="success" />
              ) : (
                <LockIcon color="error" />
              )}
            </Tooltip>
          </div>

          <Avatar
            sx={{ bgcolor: deepOrange[500] }}
            className="text-[#FFBB28] text-2xl"
            onClick={handleMenuClick}
          >
            {userIsAuthenticated.name && userIsAuthenticated.name.charAt(0).toUpperCase()}
          </Avatar>
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
            <MenuItem
              sx={{
                backgroundColor: '#FFBB28',
              }}
              onClick={handleLogoutClick}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <Button onClick={handleLoginClick}>Login</Button>
      )}
      {showAdminAccessForm && (
        <AdminAccessForm open={showAdminAccessForm} onClose={() => setShowAdminAccessForm(false)} />
      )}
    </div>
  );
};

export default Header;
