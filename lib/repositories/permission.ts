import { prisma } from '@/lib/database';

// Repository for managing permissions in the database. Provides a method to create new permissions.
const createMany = (data: { name: string }[]) => {
  return prisma.permission.createMany({
    data: data.map(({ name }) => ({
      name,
    })),
  });
};

export const permission = {
  createMany,
};
