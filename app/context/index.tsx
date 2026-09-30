'use client';

import React, { createContext, useContext, useState } from 'react';
import { AuthContextType } from '../components/types';

const authenticatedAdminUser = createContext<AuthContextType | undefined>(undefined);

export function AuthenticatedAdminUserWrapper({ children }: { children: React.ReactNode }) {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<{
    name: string | null;
    state: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
  }>({ name: null, state: 'idle' });
  return (
    <authenticatedAdminUser.Provider value={{ userIsAuthenticated, setUserIsAuthenticated }}>
      {children}
    </authenticatedAdminUser.Provider>
  );
}

export function useAuthenticatedAdminUserContext() {
  const context = useContext(authenticatedAdminUser);
  if (context === undefined) {
    throw new Error(
      'useAuthenticatedAdminUserContext must be used within an AuthenticatedAdminUserWrapper',
    );
  }
  return context;
}
