'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { Resource } from './types';
import { useAuthenticatedAdminUserContext, useResourcesContext } from '../context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NavProps {
  resourceLabel: string;
  pageNav: string;
  allPossibleResources?: Resource[];
}

const ActionButton = ({ resourceLabel, allPossibleResources, pageNav }: NavProps) => {
  const { setResourceData } = useResourcesContext();
  const navigate = useRouter();

  const { userIsAuthenticated } = useAuthenticatedAdminUserContext();
  useEffect(() => {
    //Once the nav button to add resources is rendered we want to shoot the data over to the AddResources client component.
    if (allPossibleResources) {
      const resourcesFromDatabase = allPossibleResources;
      setResourceData(resourcesFromDatabase);
    }
  }, [allPossibleResources, setResourceData]);

  return (
    <div className="inline-block">
      {!userIsAuthenticated.name ? (
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => {
            navigate.push(pageNav);
          }}
        >
          {resourceLabel}
        </Button>
      ) : (
        <Link href={pageNav} aria-label={`Navigate to ${resourceLabel}`}>
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: '#FFBB28' }}
            disableElevation
            onClick={() => {
              navigate.push(pageNav);
            }}
          >
            {resourceLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ActionButton;
