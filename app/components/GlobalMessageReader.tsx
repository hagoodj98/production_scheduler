'use client';
import React, { useEffect, useState } from 'react';
import Notifier, { Severity } from './ui/snackbar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
const GlobalMessageReader = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check the URL for a message parameter and display the notifier if present
    const checkURL = () => {
      if (decodeURIComponent(searchParams.get('msg') || '') !== '') {
        // Display the notifier
        setOpen(true);
        setTimeout(() => {
          // Replace the current URL without the message parameter after 3 seconds
          router.replace(window.location.pathname);
        }, 3000);
      }
    };

    checkURL();
  }, [searchParams, router]);

  return (
    <Notifier
      severity={Severity.info}
      message={decodeURIComponent(searchParams.get('msg') || '')}
      onClose={handleClose}
      open={open}
    />
  );
};

export default GlobalMessageReader;
