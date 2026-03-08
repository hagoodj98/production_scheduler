import { ReactNode } from "react";
import { GetAllSelectedResourcesWrapper, ResourceWrapper } from "@/app/context";

export const withAppProviders = (children: ReactNode) => {
  return (
    <ResourceWrapper>
      <GetAllSelectedResourcesWrapper>
        {children}
      </GetAllSelectedResourcesWrapper>
    </ResourceWrapper>
  );
};
