import prisma from './../../prisma/client';

const createOrderLog = async (
  orderId: number | undefined,
  employeeId: string,
  description: string,
) => {
  return await prisma.orderLog.create({
    data: {
      orderId,
      employeeId,
      description,
    },
  });
};

const getOrderLogsByOrderId = async (orderId: number) => {
  return await prisma.orderLog.findMany({
    where: {
      orderId,
    },
  });
};
const getAllOrderLogs = async () => {
  return await prisma.orderLog.findMany({
    select: {
      id: true,
      orderId: true,
      employeeId: true,
      employee: {
        select: {
          name: true,
          role: true,
          employeeId: true,
        },
      },
      order: {
        select: {
          resourceStatus: true,
          employee: {
            select: {
              name: true,
              role: true,
            },
          },
          resource: {
            select: {
              resource_name: true,
            },
          },
        },
      },
      description: true,
      creationDate: true,
    },
  });
};

export const orderLog = { createOrderLog, getOrderLogsByOrderId, getAllOrderLogs };
