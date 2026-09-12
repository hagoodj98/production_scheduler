import { prisma } from '@/lib/database';

const create = (data: {
  password: string;
  admin_key: string;
  role: string;
  employeeId: string;
}) => {
  return prisma.user.create({ data });
};
const login = async (employeeId: string) => {
  return await prisma.user.findUnique({
    where: { employeeId },
  });
};

export const user = {
  create,
  login,
};
