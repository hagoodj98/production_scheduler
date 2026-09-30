// Define a set of permissions used throughout the application
const PERMISSIONS = {
  add: { name: 'add' },
  assign: { name: 'assign' },
  reschedule: { name: 'reschedule' },
  delete: { name: 'delete' },
  view: { name: 'view' },
  all_access: { name: 'all_access' },
};
const STATUSES = {
  processing: 'Processing',
  pending: 'Pending',
  scheduled: 'Scheduled',
  busy: 'Busy',
  completed: 'Completed',
};

export { PERMISSIONS, STATUSES };
