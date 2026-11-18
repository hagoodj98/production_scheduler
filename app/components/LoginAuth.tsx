'use client';
import { useAdminUserContext } from '../context';
import { logout } from '../actions/auth';
import Tooltip from '@mui/material/Tooltip';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { deepOrange } from '@mui/material/colors';
import { useState, Suspense, lazy, useTransition } from 'react';

const loadForm = () => import('./AdminAccessForm');
const AdminAccessForm = lazy(loadForm);

const LoginAuth = () => {
  const { userIsAuthenticated, setUserIsAuthenticated } = useAdminUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showAdminAccessForm, setShowAdminAccessForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    // Logic to show the admin access form or trigger login
    startTransition(() => {
      setShowAdminAccessForm(true);
    });
  };

  const handleLogoutClick = async () => {
    await logout();
    setUserIsAuthenticated({
      state: 'unauthenticated',
      name: '',
    });
    handleMenuClose();
  };

  const handleMouseEnter = () => {
    loadForm();
  };

  return (
    <div>
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
        <Button
          disabled={isPending}
          onFocus={handleMouseEnter}
          onMouseEnter={handleMouseEnter}
          onClick={handleLoginClick}
        >
          <Tooltip title="Access Denied">
            <LockIcon color="error" />
          </Tooltip>
          <span className="text-[#FFBB28]">{isPending ? 'Loading...' : 'Login'}</span>
        </Button>
      )}
      {showAdminAccessForm && (
        <Suspense fallback={null}>
          <AdminAccessForm
            open={showAdminAccessForm}
            onClose={() => setShowAdminAccessForm(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default LoginAuth;
