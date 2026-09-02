import 'dotenv/config';
import { user } from '@/lib/repositories/user';

async function seedAdminAuth() {
  try {
    const adminData = {
      email: process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL : '',
      password: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD : '',
      admin_key: process.env.ADMIN_ACCESS_KEY ? process.env.ADMIN_ACCESS_KEY : '',
      role: 'admin',
    };

    console.log('Seeding admin auth...');
    // Add your seeding logic here

    await user.create(adminData);

    //    console.log(envVariables.POSTGRES_URL);
  } catch (error) {
    console.error('Error seeding admin auth:', error);
  }
}

seedAdminAuth();
