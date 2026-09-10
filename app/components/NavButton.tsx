'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { Resource } from './types';
import { useResourcesContext, useAuthenticatedAdminUser } from '../context';
import { useEffect, useState } from 'react';
import AdminAccessForm from './AdminAccessForm';

interface NavProps {
  resourceLabel: string;
  pageNav: string;
  isAdminUserAuthenticated?: boolean;
  allPossibleResources?: Resource[];
}

const NavButton: React.FC<NavProps> = ({
  resourceLabel,
  allPossibleResources,
  isAdminUserAuthenticated,
  pageNav,
}) => {
  const { setResourceData } = useResourcesContext();
  //const { isAuthenticated } = useAuthenticatedAdminUser();
  const [showAdminAccessForm, setShowAdminAccessForm] = useState(false);
  useEffect(() => {
    //Once the nav button to add resources is rendered we want to shoot the data over to the AddResources client component.
    if (allPossibleResources) {
      const resourcesFromDatabase = allPossibleResources;
      setResourceData(resourcesFromDatabase);
    }
  }, [allPossibleResources, setResourceData]);
  const handleAdminAccess = () => {
    setShowAdminAccessForm(true);
  };

  return (
    <div className="inline-block">
      {!isAdminUserAuthenticated ? (
        <Button size="small" variant="contained" disableElevation onClick={handleAdminAccess}>
          {resourceLabel}
        </Button>
      ) : (
        <Link href={pageNav} aria-label={`Navigate to ${resourceLabel}`}>
          <Button size="small" variant="contained" disableElevation>
            {resourceLabel}
          </Button>
        </Link>
      )}
      <AdminAccessForm
        open={showAdminAccessForm}
        redirectPath={pageNav}
        onClose={() => setShowAdminAccessForm(false)}
      />
    </div>
  );
};

export default NavButton;
