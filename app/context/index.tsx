'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  ClientResource,
  GetAllSelectedResourcesContextType,
  Resource,
  ResourcesContextType,
} from '../components/types';

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);
const GetAllSelectedResourcesContext = createContext<
  GetAllSelectedResourcesContextType | undefined
>(undefined);
const authenticatedAdminUser = createContext<
  | {
      userIsAuthenticated: { name: string | null; isAuthenticated: boolean };
      setUserIsAuthenticated: React.Dispatch<
        React.SetStateAction<{ name: string | null; isAuthenticated: boolean }>
      >;
    }
  | undefined
>(undefined);

export function AuthenticatedAdminUserWrapper({ children }: { children: React.ReactNode }) {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<{
    name: string | null;
    isAuthenticated: boolean;
  }>({ name: null, isAuthenticated: false });
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
export function ResourceWrapper({ children }: { children: React.ReactNode }) {
  const [resourceData, setResourceData] = React.useState<Resource[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = React.useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  return (
    <ResourcesContext.Provider
      value={{
        resourceData,
        setResourceData,
        selectedResourceIds,
        setSelectedResourceIds,
        selectedStatus,
        setSelectedStatus,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
}
export function useResourcesContext() {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error('useResourcesContext must be used within an AppWrapper');
  }
  return context;
}

export function GetAllSelectedResourcesWrapper({ children }: { children: React.ReactNode }) {
  const [selectedResourceData, setSelectedResourceData] = React.useState<ClientResource[]>([]);
  return (
    <GetAllSelectedResourcesContext.Provider
      value={{ selectedResourceData, setSelectedResourceData }}
    >
      {children}
    </GetAllSelectedResourcesContext.Provider>
  );
}
export function useGetAllSelectedResourcesContext() {
  const context = useContext(GetAllSelectedResourcesContext);
  if (!context) {
    throw new Error('useGetAllSelectedResourcesContext must be used within an AppWrapper');
  }
  return context;
}
