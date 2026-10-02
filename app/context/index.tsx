'use client';

import React, { createContext, useContext, useState } from 'react';
import { AuthContextType } from '../components/types';

const AdminUserContext = createContext<AuthContextType | undefined>(undefined);

export function AdminUserContextWrapper({ children }: { children: React.ReactNode }) {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<{
    name: string | null;
    state: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
  }>({ name: null, state: 'idle' });
  return (
    <AdminUserContext.Provider value={{ userIsAuthenticated, setUserIsAuthenticated }}>
      {children}
    </AdminUserContext.Provider>
  );
}

export function useAdminUserContext() {
  const context = useContext(AdminUserContext);
  if (context === undefined) {
    throw new Error('useAdminUserContext must be used within an AdminUserContextWrapper');
  }
  return context;
}
