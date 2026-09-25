import z from 'zod';

export const adminAccessValidationSchema = z.object({
  employee_id: z.string().trim().nonempty('Employee ID is required.'),
  password: z.string().trim().nonempty('Password is required.'),
  admin_key: z.string().trim().nonempty('Admin key is required.'),
});
