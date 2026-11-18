'use client';

import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, NotifierContextType } from '../components/types';

const AdminUserContext = createContext<AuthContextType | undefined>(undefined);
const notifierContext = createContext<NotifierContextType | undefined>(undefined);

export function NotifierContextWrapper({ children }: { children: React.ReactNode }) {
  const [eventComponentNotifier, setEventComponentNotifier] =
    useState<NotifierContextType['eventComponentNotifier']>(null);
  return (
    <notifierContext.Provider value={{ eventComponentNotifier, setEventComponentNotifier }}>
      {children}
    </notifierContext.Provider>
  );
}

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
export function useNotifierContext() {
  const context = useContext(notifierContext);
  if (context === undefined) {
    throw new Error('useNotifierContext must be used within a NotifierContextWrapper');
  }
  return context;
}
export function useAdminUserContext() {
  const context = useContext(AdminUserContext);
  if (context === undefined) {
    throw new Error('useAdminUserContext must be used within an AdminUserContextWrapper');
  }
  return context;
}
