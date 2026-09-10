import z from 'zod';

export const adminAccessValidationSchema = z.object({
  email: z.string().trim().nonempty('Email is required.'),
  password: z.string().trim().nonempty('Password is required.'),
  admin_key: z.string().trim().nonempty('Admin key is required.'),
  redirectPath: z.string().trim().nonempty('Redirect path is required.'),
});
