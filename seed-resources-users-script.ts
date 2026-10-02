import 'dotenv/config';
import { user } from '@/lib/repositories/user';
import { Employee } from './app/components/types';
import { generateEmployee } from './utils/generateEmployeeMeta';
import { permission } from './lib/repositories';
import { userPermission } from './lib/repositories/UserPermission';
import { PERMISSIONS } from './utils/GlobalVar';
import seedResources from './prisma/seeds/0_resources';
import prisma from './prisma/client';
import crypto from 'crypto';
import { hashPassword } from './utils/hashPassword';

async function seedAdminAuth() {
  try {
    const insertEmployees: Employee[] = [];
    const insertUserPermission: { userId: number; permissionId: number }[] = [];
    const johnAdminPassword = process.env.JOHN_ADMIN_PASSWORD;
    const janeAdminPassword = process.env.JANE_ADMIN_PASSWORD;
    const michaelAdminPassword = process.env.MICHAEL_ADMIN_PASSWORD;
    const williamAdminPassword = process.env.WILLIAM_ADMIN_PASSWORD;
    const emilyAdminPassword = process.env.EMILY_ADMIN_PASSWORD;
    const oliviaAdminPassword = process.env.OLIVIA_ADMIN_PASSWORD;
    if (
      !johnAdminPassword ||
      !janeAdminPassword ||
      !michaelAdminPassword ||
      !williamAdminPassword ||
      !emilyAdminPassword ||
      !oliviaAdminPassword
    ) {
      throw new Error('One or more admin passwords are not set in the environment variables');
    }
    // Seed initial admin and worker employees with their permissions
    insertEmployees.push(
      generateEmployee(
        'John Doe',
        process.env.JOHN_ADMIN_EMAIL || 'john.doe@example.com',
        'EMP001',
        hashPassword(johnAdminPassword),
        null,
        'worker',
      ),
    );
    // Assign 'read' permission to the first user (John Doe)
    insertUserPermission.push({
      userId: 1,
      permissionId: Object.keys(PERMISSIONS).indexOf('view') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Jane Smith',
        process.env.JANE_ADMIN_EMAIL || 'jane.smith@example.com',
        'EMP002',
        hashPassword(janeAdminPassword),
        process.env.CREATE_ASSIGN_ADMIN_ACCESS_KEY || 'create_assign_admin_access_key',
        'admin',
      ),
    );
    // Assign 'CREATE_RESOURCE' and 'ASSIGN_TASK' permissions to the second user (Jane Smith)
    insertUserPermission.push({
      userId: 2,
      permissionId: Object.keys(PERMISSIONS).indexOf('add') + 1,
    });
    insertUserPermission.push({
      userId: 2,
      permissionId: Object.keys(PERMISSIONS).indexOf('assign') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Michael Johnson',
        process.env.MICHAEL_ADMIN_EMAIL || 'michael.johnson@example.com',
        'EMP003',
        hashPassword(michaelAdminPassword),
        process.env.ALL_ACCESS_ADMIN_ACCESS_KEY || 'all_access_admin_access_key',
        'admin',
      ),
    );
    // Assign 'ALL_ACCESS' permission to the third user (Michael Johnson)
    insertUserPermission.push({
      userId: 3,
      permissionId: Object.keys(PERMISSIONS).indexOf('all_access') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'William Brown',
        process.env.WILLIAM_ADMIN_EMAIL || 'william.brown@example.com',
        'EMP005',
        hashPassword(williamAdminPassword),
        null,
        'worker',
      ),
    );
    // Assign 'READ_ONLY' permission to the fifth user (William Brown)
    insertUserPermission.push({
      userId: 4,
      permissionId: Object.keys(PERMISSIONS).indexOf('view') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Emily Davis',
        process.env.EMILY_ADMIN_EMAIL || 'emily.davis@example.com',
        'EMP004',
        hashPassword(emilyAdminPassword),
        process.env.RESCHEDULE_TASK_ADMIN_ACCESS_KEY || 'reschedule_task_admin_access_key',
        'admin',
      ),
    );
    // Assign 'RESCHEDULE_TASKS' and 'DELETE_TASKS' permissions to the fourth user (Emily Davis)
    insertUserPermission.push({
      userId: 5,
      permissionId: Object.keys(PERMISSIONS).indexOf('reschedule') + 1,
    });
    insertUserPermission.push({
      userId: 5,
      permissionId: Object.keys(PERMISSIONS).indexOf('delete') + 1,
    });
    insertEmployees.push(
      generateEmployee(
        'Olivia Wilson',
        process.env.OLIVIA_ADMIN_EMAIL || 'olivia.wilson@example.com',
        'EMP006',
        hashPassword(oliviaAdminPassword),
        null,
        'worker',
      ),
    );
    // Assign 'READ_ONLY' permission to the sixth user (Olivia Wilson)
    insertUserPermission.push({
      userId: 6,
      permissionId: Object.keys(PERMISSIONS).indexOf('view') + 1,
    });

    const permissionRecords: { name: string }[] = [];
    //
    Object.values(PERMISSIONS).forEach((p) => {
      permissionRecords.push({ name: p.name });
    });

    // Add your seeding logic here
    await seedResources();
    await permission.createMany(permissionRecords);
    await user.createMany(insertEmployees);
    await userPermission.createMany(insertUserPermission);

    console.log('Seeding employees and permissions in appropriate tables');

    //    console.log(envVariables.POSTGRES_URL);
  } catch (error) {
    console.error('Error seeding employee auth:', error);
  } finally {
    console.log('Finished seeding employee auth');
    prisma.$disconnect();
  }
}

seedAdminAuth();
