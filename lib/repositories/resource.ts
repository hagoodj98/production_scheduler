import { prisma } from '@/lib/database';

const findAll = () => {
  return prisma.resource.findMany();
};

const findByNamePrefix = (name: string) => {
  return prisma.resource.findMany({
    where: {
      resource_name: {
        startsWith: name,
        mode: 'insensitive',
      },
    },
    orderBy: { resource_name: 'asc' },
    take: 100,
  });
};

export const resource = {
  findAll,
  findByNamePrefix,
};
