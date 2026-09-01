'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { Resource } from './types';
import { useResourcesContext } from '../context';
import { useEffect, useState } from 'react';
import AdminAccessForm from './AdminAccessForm';

interface NavProps {
  resourceLabel: string;
  pageNav?: string;
  adminAccess?: boolean;
  allPossibleResources?: Resource[];
}

const NavButton: React.FC<NavProps> = ({ resourceLabel, allPossibleResources, adminAccess }) => {
  const { setResourceData } = useResourcesContext();
  const [showAdminAccessForm, setShowAdminAccessForm] = useState(false);
  useEffect(() => {
    //Once the nav button to add resources is rendered we want to shoot the data over to the AddResources client component.
    if (allPossibleResources) {
      const resourcesFromDatabase = allPossibleResources;
      setResourceData(resourcesFromDatabase);
    }
  }, [allPossibleResources, setResourceData]);
  const handleAdminAccess = () => {
    if (!adminAccess) {
      setShowAdminAccessForm(true);
    }
  };

  return (
    <div className="inline-block">
      <Link href={!adminAccess ? '#' : '/add-resource'} aria-label={`Navigate to ${resourceLabel}`}>
        <Button size="small" variant="contained" disableElevation onClick={handleAdminAccess}>
          {resourceLabel}
        </Button>
      </Link>
      {showAdminAccessForm && <AdminAccessForm />}
    </div>
  );
};

export default NavButton;
