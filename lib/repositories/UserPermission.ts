import prisma from './../../prisma/client';

const createMany = (data: { userId: number; permissionId: number }[]) => {
  return prisma.userPermission.createMany({
    data: data.map(({ userId, permissionId }) => ({
      userId,
      permissionId,
    })),
  });
};
const find = (userId: number) => {
  return prisma.userPermission.findMany({
    where: {
      userId,
    },
    include: {
      permission: true,
    },
  });
};

export const userPermission = {
  createMany,
  find,
};
