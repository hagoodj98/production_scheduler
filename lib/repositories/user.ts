import { prisma } from '@/lib/database';

const create = (data: { email: string; password: string; admin_key: string; role: string }) => {
  return prisma.user.create({ data });
};
const find = (id: number) => {
  return prisma.user.findFirst({
    where: { id },
  });
};

export const user = {
  create,
  find,
};
