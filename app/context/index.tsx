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
  | { isAuthenticated: boolean; setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }
  | undefined
>(undefined);
export function AuthenticatedAdminUserWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <authenticatedAdminUser.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </authenticatedAdminUser.Provider>
  );
}

export function useAuthenticatedAdminUser() {
  const context = useContext(authenticatedAdminUser);
  if (context === undefined) {
    throw new Error(
      'useAuthenticatedAdminUser must be used within an AuthenticatedAdminUserWrapper',
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
    throw new Error('useResourcesContext must be used within an AppWrapper');
  }
  return context;
}
