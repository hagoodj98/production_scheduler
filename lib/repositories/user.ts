import { Employee } from '@/app/components/types';
import prisma from './../../prisma/client';

const createMany = (data: Employee[]) => {
  return prisma.user.createMany({
    data: data.map(({ name, email, password, admin_key, role, employeeId }) => ({
      name,
      email,
      password,
      admin_key,
      role,
      employeeId,
    })),
  });
};
const login = async (employeeId: string) => {
  return await prisma.user.findUnique({
    where: { employeeId },
  });
};

export const user = {
  createMany,
  login,
};
