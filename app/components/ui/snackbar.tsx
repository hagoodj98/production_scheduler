'use client';
import React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Snackbar component for displaying notifications with different severity levels.
export enum Severity {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
}
export interface NotifierProps {
  open: boolean;
  message: string;
  severity?: Severity;
  duration?: number;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}

const Notifier: React.FC<NotifierProps> = ({
  open,
  message,
  severity,
  duration = 3000,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notifier;
