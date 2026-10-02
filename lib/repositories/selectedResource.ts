import prisma from './../../prisma/client';

const findAllWithOrders = () => {
  // Fetch all selected resources that have at least one active production order (not deleted)
  return prisma.selectedResource.findMany({
    where: {
      productionOrders: {
        // Only include resources that have at least one active production order (not deleted)
        some: {},
      },
    },
    // Include the associated production orders for each selected resource
    include: {
      productionOrders: {
        // Only include active production orders (not deleted)
        where: {
          deletedAt: null,
        },
      },
    },
  });
};

const findByNameOrThrow = (resource_name: string) => {
  return prisma.selectedResource.findFirstOrThrow({
    where: { resource_name },
  });
};

const findByIdOrThrow = (id: number) => {
  return prisma.selectedResource.findFirstOrThrow({
    where: { id },
  });
};

const create = (resource_name: string) => {
  return prisma.selectedResource.create({
    data: { resource_name },
  });
};

const findAll = () => {
  return prisma.selectedResource.findMany();
};

export const selectedResource = {
  findAllWithOrders,
  findByNameOrThrow,
  findByIdOrThrow,
  create,
  findAll,
};
