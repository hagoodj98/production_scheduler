'use client';
import { useAuthenticatedAdminUserContext } from '../context';
import { useEffect } from 'react';
export const CheckAuth = () => {
  const { userIsAuthenticated, setUserIsAuthenticated } = useAuthenticatedAdminUserContext();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/fetch-auth-status', {
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
            name: data.userName,
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
