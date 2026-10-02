'use client';
import { useAdminUserContext } from '../context';
import { useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const CheckAuth = () => {
  const { userIsAuthenticated, setUserIsAuthenticated } = useAdminUserContext();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.AUTH_STATUS, {
          method: 'GET',
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error fetching auth status:', errorData);
          if (userIsAuthenticated.state !== 'unauthenticated') {
            setUserIsAuthenticated({
              state: 'unauthenticated',
              name: '',
            });
          }

          return; // Stop further execution if there's an error
        }
        const data = await response.json();
        if (userIsAuthenticated.state !== 'authenticated') {
          setUserIsAuthenticated({
            state: 'authenticated',
            name: data.adminName,
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, [userIsAuthenticated, setUserIsAuthenticated]);

  return (
    <>
      {userIsAuthenticated.state === 'authenticated'
        ? null
        : userIsAuthenticated.state === 'unauthenticated'
          ? null
          : ''}
    </>
  );
};

export default CheckAuth;
