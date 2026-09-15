'use server';

import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { z } from 'zod';
import { user, userPermission } from '../../lib/repositories';
import { createSession, deleteSession } from '../../lib/session';

export async function login(state: unknown, formData: FormData) {
  try {
    const { employee_id, password, admin_key } = await adminAccessValidationSchema.parseAsync({
      employee_id: formData.get('employee_id'),
      password: formData.get('password'),
      admin_key: formData.get('admin_key'),
    });

    const authenticateUser = await user.login(employee_id);
    if (!authenticateUser) {
      throw new Error('Invalid employee ID');
    }
    if (authenticateUser.password !== password || authenticateUser.admin_key !== admin_key) {
      //Kind of want to keep this section error ambiguous to not reveal which part failed
      throw new Error('Invalid password or admin key');
    }
    const userPermissions = await userPermission.find(authenticateUser.id);
    // Extract the permission names from the userPermissions array
    const permissions = userPermissions.map((up) => up.permission.name);

    const payloadSession = {
      employee_id: authenticateUser.employeeId,
      role: authenticateUser.role,
      permissions: permissions,
    };

    await createSession(payloadSession);
    return { login_success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.issues.map((err) => err.message).join(', '));
      return {
        fields: error.issues.map((err) => err.path.join('.')),
        errors: error.issues.map((err) => err.message),
      };
    }
    console.error(error);
    return {
      fields: ['form'],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
export async function logout() {
  await deleteSession();
  return { logout_success: true };
}
