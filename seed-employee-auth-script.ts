import 'dotenv/config';
import { user } from '@/lib/repositories/user';
import { Employee } from './app/components/types';
import crypto from 'crypto';
function generateEmployee(
  name: string,
  email: string,
  employeeId: string,
  password: string,
  admin_key: string | undefined,
  role: string,
  userPermissions: string[],
): Employee {
  return {
    id: crypto.randomUUID(), // You can set this to a unique value or handle it differently
    name,
    email,
    employeeId,
    password,
    admin_key,
    role,
    userPermissions,
  };
}

async function seedAdminAuth() {
  try {
    const employees: Employee[] = [];

    employees.push(
      generateEmployee(
        'John Doe',
        process.env.JOHN_ADMIN_EMAIL || 'john.doe@example.com',
        'EMP001',
        process.env.JOHN_ADMIN_PASSWORD || 'password123',
        undefined,
        'worker',
        ['read'],
      ),
    );
    employees.push(
      generateEmployee(
        'Jane Smith',
        process.env.JANE_ADMIN_EMAIL || 'jane.smith@example.com',
        'EMP002_admin',
        process.env.JANE_ADMIN_PASSWORD || 'password456',
        process.env.CREATE_ASSIGN_ADMIN_ACCESS_KEY || 'create_assign_admin_access_key',
        'admin',
        ['CREATE_RESOURCE', 'ASSIGN_TASK'],
      ),
    );
    employees.push(
      generateEmployee(
        'Michael Johnson',
        process.env.MICHAEL_ADMIN_EMAIL || 'michael.johnson@example.com',
        'EMP003_admin',
        process.env.MICHAEL_ADMIN_PASSWORD || 'password789',
        process.env.ALL_ACCESS_ADMIN_ACCESS_KEY || 'all_access_admin_access_key',
        'admin',
        ['ALL_ACCESS'],
      ),
    );
    employees.push(
      generateEmployee(
        'William Brown',
        process.env.WILLIAM_ADMIN_EMAIL || 'william.brown@example.com',
        'EMP005',
        process.env.WILLIAM_ADMIN_PASSWORD || 'password202',
        undefined,
        'worker',
        ['read'],
      ),
    );
    employees.push(
      generateEmployee(
        'Emily Davis',
        process.env.EMILY_ADMIN_EMAIL || 'emily.davis@example.com',
        'EMP004_admin',
        process.env.EMILY_ADMIN_PASSWORD || 'password101',
        process.env.RESCHEDULE_TASK_ADMIN_ACCESS_KEY || 'reschedule_task_admin_access_key',
        'admin',
        ['RESCHEDULE_TASK', 'DELETE_TASK'],
      ),
    );

    employees.push(
      generateEmployee(
        'Olivia Wilson',
        process.env.OLIVIA_ADMIN_EMAIL || 'olivia.wilson@example.com',
        'EMP006',
        process.env.OLIVIA_ADMIN_PASSWORD || 'password303',
        undefined,
        'worker',
        ['read'],
      ),
    );

    console.log('Seeding admin auth...');
    // Add your seeding logic here

    for (const employee of employees) {
      await user.create(employee);
    }

    //    console.log(envVariables.POSTGRES_URL);
  } catch (error) {
    console.error('Error seeding admin auth:', error);
  }
}

seedAdminAuth();
