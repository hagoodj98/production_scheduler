import { prisma } from '@/lib/database';

const create = (data: { email: string; password: string; admin_key: string; role: string }) => {
  return prisma.user.create({ data });
};
const login = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const user = {
  create,
  login,
};
