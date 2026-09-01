import z from 'zod';

export const adminAccessValidationSchema = z.object({
  username: z.string().trim().nonempty('Username is required.'),
  password: z.string().trim().nonempty('Password is required.'),
});
