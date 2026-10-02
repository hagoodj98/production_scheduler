'use client';
import React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { NotifierAction, NotifierState } from '../types';

// Snackbar component for displaying notifications with different severity levels.
export enum Severity {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
}
// Reducer function for managing the state of the notifier component.
export const notifierReducer = (notifierState: NotifierState, action: NotifierAction) => {
  switch (action.type) {
    case 'setOpenNotifier':
      return {
        ...notifierState,
        openNotifier: action.value,
      };
    case 'setNotifierMessage':
      return {
        ...notifierState,
        notifierMessage: action.value,
      };
    case 'setNotifierSeverity':
      return {
        ...notifierState,
        notifierSeverity: action.value,
      };

    default:
      return notifierState;
  }
};
export const initialNotifierState: NotifierState = {
  openNotifier: false,
  notifierMessage: '',
  notifierSeverity: Severity.success,
};
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
