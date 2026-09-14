import { prisma } from '@/lib/database';

const createMany = (data: { userId: number; permissionId: number }[]) => {
  return prisma.userPermission.createMany({
    data: data.map(({ userId, permissionId }) => ({
      userId,
      permissionId,
    })),
  });
};

export const userPermission = {
  createMany,
};
