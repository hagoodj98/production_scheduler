'use server';

import { adminAccessValidationSchema } from '../../utils/validationSchema';
import { z } from 'zod';

interface FormData {
  email: string;
  password: string;
  admin_key: string;
}
export async function signin(state: unknown, formData: FormData) {
  try {
    const { email, password, admin_key } = await adminAccessValidationSchema.parseAsync(formData);

    console.log(email);
    console.log(password);
    console.log(admin_key);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.issues.map((err) => err.message).join(', '));
      return {
        fields: error.issues.map((err) => err.path.join('.')),
        errors: error.issues.map((err) => err.message),
      };
    }
    console.error(error);
  }
}
