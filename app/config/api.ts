const AUTH = '/api/auth';
const ORDER = '/api/order';
const RESOURCE = '/api/resource';
export const API_ENDPOINTS = {
  LOAD_ORDERS: `${ORDER}/load`,
  DELETE_ORDER: `${ORDER}/delete`,
  LOAD_EMPLOYEES: `${ORDER}/load-employee`,
  MARK_PENDING: `${ORDER}/mark-pending`,
  RESCHEDULE_ORDER: `${ORDER}/reschedule`,
  SCHEDULE_ORDER: `${ORDER}/schedule`,
  AUTH_CHECK: `${AUTH}/permission-check`,
  AUTH_STATUS: `${AUTH}/status`,
  LOAD_RESOURCES: `${RESOURCE}/load`,
  ADD_RESOURCE: `${RESOURCE}/add`,
  SEARCH_RESOURCES: `${RESOURCE}/search`,
};
