"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import { Resource } from "./types";
import { useResourcesContext } from "../context";
import { useEffect } from "react";

interface NavProps {
  resourceLabel: string;
  pageNav?: string;
  allPossibleResources?: Resource[];
}

const NavButton: React.FC<NavProps> = ({
  resourceLabel,
  pageNav,
  allPossibleResources,
}) => {
  const { setResourceData } = useResourcesContext();
  useEffect(() => {
    //Once the nav button to add resources is rendered we want to shoot the data over to the AddResources client component.
    if (allPossibleResources) {
      const resourcesFromDatabase = allPossibleResources;
      setResourceData(resourcesFromDatabase);
    }
  }, [allPossibleResources, setResourceData]);

  return (
    <div className="inline-block">
      <Link href={pageNav ?? "#"} aria-label={`Navigate to ${resourceLabel}`}>
        <Button size="small" variant="contained" disableElevation>
          {resourceLabel}
        </Button>
      </Link>
    </div>
  );
};

export default NavButton;
