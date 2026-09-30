'use server';

import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { user, userPermission } from '../../lib/repositories';
import { createSession, deleteSession } from '../../lib/session';
import { handleError } from '../../utils/ErrorHandlingHelper';
import { CustomError } from '../../utils/CustomErrors';
import { z } from 'zod';
import { IssueCount } from 'next/dist/next-devtools/dev-overlay/menu/dev-overlay-menu';
// Authentication actions: login and logout
export async function login(state: unknown, formData: FormData) {
  try {
    // Validate the admin access form data using Zod schema
    const { employee_id, password, admin_key } = await adminAccessValidationSchema.parseAsync({
      employee_id: formData.get('employee_id'),
      password: formData.get('password'),
      admin_key: formData.get('admin_key'),
    });
    // Authenticate the user with the provided credentials
    const authenticateUser = await user.login(employee_id);
    if (!authenticateUser) {
      throw new Error('Invalid employee ID');
    }
    //Kind of want to keep this section error ambiguous to not reveal which part failed

    if (authenticateUser.password !== password || authenticateUser.admin_key !== admin_key) {
      throw new Error('Invalid password or admin key');
    }
    // Extract the permission names from the userPermissions array
    const userPermissions = await userPermission.find(authenticateUser.id);
    const permissions = userPermissions.map((up) => up.permission.name);
    // Prepare the session payload with user information and permissions
    const payloadSession = {
      employee_id: authenticateUser.employeeId,
      role: authenticateUser.role,
      permissions: permissions,
      name: authenticateUser.name,
    };
    // Create the session with the prepared payload
    await createSession(payloadSession);
    return { name: authenticateUser.name, login_success: true };
  } catch (error) {
    // Handle any errors that occur during the login process
    if (error instanceof z.ZodError) {
      return {
        fields: error.issues.map((issue) => ({
          path: issue.path.join(''),
          message: issue.message,
        })),
      };
    }
    if (error instanceof CustomError) {
      return { error: error.message, status: error.statusCode };
    }
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }
    return { error: 'There was an internal error. Try again later', status: 500 };
  }
}
export async function logout() {
  await deleteSession();
  return { logout_success: true };
}
