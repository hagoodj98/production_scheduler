import { prisma } from '@/lib/database';

const create = (data: {
  email: string;
  name: string;
  password: string;
  admin_key?: string | undefined;
  role: string;
  employeeId: string;
  userPermissions: string[];
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
