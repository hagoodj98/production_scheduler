import { Employee } from '@/app/components/types';

function generateEmployee(
  name: string,
  email: string,
  employeeId: string,
  password: string,
  admin_key: string | null,
  role: string,
  userPermissions?: string[],
): Employee {
  return {
    name,
    email,
    employeeId,
    password,
    admin_key,
    role,
    userPermissions,
  };
}
function generateUserPermission(userId: number, name: string): { userId: number; name: string } {
  return { userId, name };
}
export { generateUserPermission, generateEmployee };
