import 'dotenv/config';
import { user } from '@/lib/repositories/user';
import { Employee } from './app/components/types';
import { generateEmployee } from './utils/generateEmployeeMeta';
import { permission } from './lib/repositories';
import { userPermission } from './lib/repositories/UserPermission';

async function seedAdminAuth() {
  try {
    const insertEmployees: Employee[] = [];
    const insertUserPermission: { userId: number; permissionId: number }[] = [];
    const insertPermission: { name: string }[] = [
      { name: 'READ_ONLY' },
      { name: 'ADD_RESOURCE' },
      { name: 'ASSIGN_TASKS' },
      { name: 'ALL_ACCESS_TO_TASKS' },
      { name: 'RESCHEDULE_TASKS' },
      { name: 'DELETE_TASKS' },
    ];
    // Seed initial admin and worker employees with their permissions
    insertEmployees.push(
      generateEmployee(
        'John Doe',
        process.env.JOHN_ADMIN_EMAIL || 'john.doe@example.com',
        'EMP001',
        process.env.JOHN_ADMIN_PASSWORD || 'password123',
        null,
        'worker',
      ),
    );
    // Assign 'read' permission to the first user (John Doe)
    insertUserPermission.push({
      userId: 1,
      permissionId: insertPermission.findIndex((p) => p.name === 'read') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Jane Smith',
        process.env.JANE_ADMIN_EMAIL || 'jane.smith@example.com',
        'EMP002',
        process.env.JANE_ADMIN_PASSWORD || 'password456',
        process.env.CREATE_ASSIGN_ADMIN_ACCESS_KEY || 'create_assign_admin_access_key',
        'admin',
      ),
    );
    // Assign 'CREATE_RESOURCE' and 'ASSIGN_TASK' permissions to the second user (Jane Smith)
    insertUserPermission.push({
      userId: 2,
      permissionId: insertPermission.findIndex((p) => p.name === 'CREATE_RESOURCE') + 1,
    });
    insertUserPermission.push({
      userId: 2,
      permissionId: insertPermission.findIndex((p) => p.name === 'ASSIGN_TASK') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Michael Johnson',
        process.env.MICHAEL_ADMIN_EMAIL || 'michael.johnson@example.com',
        'EMP003',
        process.env.MICHAEL_ADMIN_PASSWORD || 'password789',
        process.env.ALL_ACCESS_ADMIN_ACCESS_KEY || 'all_access_admin_access_key',
        'admin',
      ),
    );
    // Assign 'ALL_ACCESS' permission to the third user (Michael Johnson)
    insertUserPermission.push({
      userId: 3,
      permissionId: insertPermission.findIndex((p) => p.name === 'ALL_ACCESS') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'William Brown',
        process.env.WILLIAM_ADMIN_EMAIL || 'william.brown@example.com',
        'EMP005',
        process.env.WILLIAM_ADMIN_PASSWORD || 'password202',
        null,
        'worker',
      ),
    );
    // Assign 'read' permission to the fifth user (William Brown)
    insertUserPermission.push({
      userId: 5,
      permissionId: insertPermission.findIndex((p) => p.name === 'read') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Emily Davis',
        process.env.EMILY_ADMIN_EMAIL || 'emily.davis@example.com',
        'EMP004',
        process.env.EMILY_ADMIN_PASSWORD || 'password101',
        process.env.RESCHEDULE_TASK_ADMIN_ACCESS_KEY || 'reschedule_task_admin_access_key',
        'admin',
      ),
    );
    // Assign 'RESCHEDULE_TASK' and 'DELETE_TASK' permissions to the fourth user (Emily Davis)
    insertUserPermission.push({
      userId: 4,
      permissionId: insertPermission.findIndex((p) => p.name === 'RESCHEDULE_TASK') + 1,
    });
    insertUserPermission.push({
      userId: 4,
      permissionId: insertPermission.findIndex((p) => p.name === 'DELETE_TASK') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Olivia Wilson',
        process.env.OLIVIA_ADMIN_EMAIL || 'olivia.wilson@example.com',
        'EMP006',
        process.env.OLIVIA_ADMIN_PASSWORD || 'password303',
        null,
        'worker',
      ),
    );
    // Assign 'read' permission to the sixth user (Olivia Wilson)
    insertUserPermission.push({
      userId: 6,
      permissionId: insertPermission.findIndex((p) => p.name === 'read') + 1,
    });

    // Add your seeding logic here
    await permission.createMany(insertPermission);
    await user.createMany(insertEmployees);
    await userPermission.createMany(insertUserPermission);
    console.log('Seeding employees and permissions in appropriate tables');

    //    console.log(envVariables.POSTGRES_URL);
  } catch (error) {
    console.error('Error seeding employee auth:', error);
  }
}

seedAdminAuth();
