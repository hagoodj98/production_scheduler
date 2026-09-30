import prisma from './../../prisma/client';
import type { ProductionOrderWriteInput } from '../../app/components/types';

const findAll = () => {
  return prisma.productionOrder.findMany({
    include: {
      resource: true,
    },
  });
};

const findAllForStatusCheck = () => {
  return prisma.productionOrder.findMany({
    select: {
      id: true,
      dayMonthYear: true,
      startTime: true,
      endTime: true,
      employee: {
        select: {
          employeeId: true,
          name: true,
        },
      },
      resourceStatus: true,
      resourceId: true,
    },
  });
};

const findByIdOrThrow = (id: number) => {
  return prisma.productionOrder.findUniqueOrThrow({
    where: { id },
  });
};

const create = (data: ProductionOrderWriteInput) => {
  return prisma.productionOrder.create({ data });
};
const update = (id: number, data: ProductionOrderWriteInput) => {
  return prisma.productionOrder.update({
    where: { id },
    data,
  });
};

const softRemove = (id: number) => {
  return prisma.productionOrder.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const productionOrder = {
  findAll,
  findAllForStatusCheck,
  findByIdOrThrow,
  create,
  update,
  softRemove,
};
