'use server';

import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { z } from 'zod';
import { user } from '../../lib/repositories';

interface FormData {
  email: string;
  password: string;
  admin_key: string;
}
export async function signin(state: unknown, formData: FormData) {
  try {
    const { email, password, admin_key } = await adminAccessValidationSchema.parseAsync(formData);

    const authenticateUser = await user.login(email);
    if (!authenticateUser) {
      throw new Error('Invalid email');
    }
    if (authenticateUser.password !== password || authenticateUser.admin_key !== admin_key) {
      //Kind of want to keep this section error ambiguous to not reveal which part failed
      throw new Error('Invalid password or admin key');
    }
    return { userAuthenticated: true };
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
