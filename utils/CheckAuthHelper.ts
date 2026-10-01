import { cookies } from 'next/headers';
import { decrypt } from '../lib/session';
import type { PayloadSession } from '../app/components/types';
import { CustomError } from './CustomErrors';
import { PERMISSIONS, STATUSES } from './GlobalVar';
import { productionOrder } from '@/lib/repositories';
// Helper function to check if the user has the required permission before proceeding
export const checkAuthMetaData = async (
  permission?: string,
  path?: string | null,
  deleteOrderId?: number,
) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  // Check if the session cookie exists and is valid
  if (!sessionCookie || sessionCookie === 'undefined') {
    throw new CustomError('You are unauthenticated', 401);
  }
  const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
  // Check if the user has the required permission in their session payload
  const hasPermission = payloadSession.permissions.find(
    // Check if the current permission matches the required permission or if the user has all access
    (p) => p === permission || p === PERMISSIONS.all_access.name,
  );
  const isWorker = payloadSession.permissions.includes(PERMISSIONS.view.name);
  // if user is a worker, they've gained unauthoruzed access to the system
  if (isWorker) {
    throw new CustomError('Unauthorized access for worker role', 403);
  }
  // Allow admin users to access the order log without further permission checks
  if (path?.includes('order-log') && payloadSession.role === 'admin') {
    return;
  }

  // Check if the user has the required permission before proceeding
  if (permission && !hasPermission) {
    if (path?.includes('add-resource')) {
      throw new CustomError(`You are unauthorized to ${permission} a resource`, 403);
    }
    // Check if the user is trying to assign an order without the appropriate permission
    if (path?.includes('assign-order') && permission !== PERMISSIONS.reschedule.name) {
      throw new CustomError(`You are unauthorized to assign an order`, 403);
    }
    throw new CustomError(`You are unauthorized to ${permission} this resource`, 403);
  }
  // If the user has passed all checks, they are authorized to proceed but prevent if status is completed or busy
  const orderID = path?.split('/').pop();

  if (Number(orderID)) {
    const orderStatus = (await productionOrder.findByIdOrThrow(Number(orderID))).resourceStatus;
    if (orderStatus === STATUSES.completed || orderStatus === STATUSES.busy) {
      throw new CustomError(`You cannot modify an order that is ${orderStatus}`, 403);
    }
  } else if (deleteOrderId) {
    // Check the status of the order before allowing deletion
    const orderStatus = (await productionOrder.findByIdOrThrow(Number(deleteOrderId)))
      .resourceStatus;
    if (orderStatus === STATUSES.busy) {
      throw new CustomError(`You cannot delete a busy order that is ${orderStatus}`, 403);
    }
  }

  return { adminName: payloadSession.name, employeeId: payloadSession.employee_id };
};
