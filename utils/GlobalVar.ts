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
  deleted: 'Deleted',
  completed: 'Completed',
};
const STATUS_COLORS: Record<string, string> = {
  [STATUSES.processing]: '#cccccc',
  [STATUSES.pending]: '#FFBB28',
  [STATUSES.scheduled]: '#007bff',
  [STATUSES.busy]: '#DB441A',
  [STATUSES.deleted]: '#092ec0',
  [STATUSES.completed]: '#2ecc71',
};

export { PERMISSIONS, STATUSES, STATUS_COLORS };
