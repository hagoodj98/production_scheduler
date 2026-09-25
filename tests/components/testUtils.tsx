import { ReactNode } from "react";
import {
  AuthenticatedAdminUserWrapper,
  GetAllSelectedResourcesWrapper,
  ResourceWrapper,
} from "@/app/context";

export const withAppProviders = (children: ReactNode) => {
  return (
    <AuthenticatedAdminUserWrapper>
      <ResourceWrapper>
        <GetAllSelectedResourcesWrapper>{children}</GetAllSelectedResourcesWrapper>
      </ResourceWrapper>
    </AuthenticatedAdminUserWrapper>
  );
};
