import { prisma } from '@/lib/database';

const create = (data: { email: string; password: string; admin_key: number }) => {
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
