import { prisma } from "@/lib/database";

type ProductionOrderWriteInput = {
  dayMonthYear: Date;
  startTime: Date;
  endTime: Date;
  resourceId: number;
  resourceStatus: string;
};

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
      resourceStatus: true,
      resourceId: false,
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

const remove = (id: number) => {
  return prisma.productionOrder.delete({
    where: { id },
  });
};

export const productionOrderRepository = {
  findAll,
  findAllForStatusCheck,
  findByIdOrThrow,
  create,
  update,
  remove,
};
