'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { Resource } from './types';
import { useAdminUserContext } from '../context';
import { useRouter } from 'next/navigation';

interface NavProps {
  resourceLabel: string;
  pageNav: string;
  allPossibleResources?: Resource[];
}

const ActionButton = ({ resourceLabel, pageNav }: NavProps) => {
  // const { setResourceData } = useResourcesContext();
  const navigate = useRouter();

  const { userIsAuthenticated } = useAdminUserContext();

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
            sx={{
              backgroundColor: '#FFBB28',
              ':hover': {
                backgroundColor: '#FFA500',
              },
            }}
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
