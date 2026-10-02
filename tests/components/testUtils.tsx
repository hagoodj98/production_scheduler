import { ReactNode } from 'react';
import { AdminUserContextWrapper } from '@/app/context';

export const withAppProviders = (children: ReactNode) => {
  return <AdminUserContextWrapper>{children}</AdminUserContextWrapper>;
};
