import prisma from './../../prisma/client';

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

const upsert = (resource_name: string) => {
  return prisma.resource.upsert({
    where: { resource_name },
    create: { resource_name },
    update: {},
  });
};
export const resource = {
  findAll,
  findByNamePrefix,
  upsert,
};
