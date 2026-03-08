import { prisma } from "@/lib/database";

const findAllWithOrders = () => {
  return prisma.selectedResource.findMany({
    select: {
      id: true,
      resource_name: true,
      productionOrders: {
        select: {
          id: true,
          dayMonthYear: true,
          startTime: true,
          endTime: true,
          resourceStatus: true,
          resourceId: true,
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

export const selectedResourceRepository = {
  findAllWithOrders,
  findByNameOrThrow,
  findByIdOrThrow,
  create,
};
