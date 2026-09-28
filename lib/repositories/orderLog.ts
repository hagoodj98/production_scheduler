import prisma from './../../prisma/client';

const createOrderLog = async (orderId: number, employeeId: string) => {
  return await prisma.orderLog.create({
    data: {
      orderId,
      employeeId,
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
    include: {
      order: true,
      employee: true,
    },
  });
};

export const orderLog = { createOrderLog, getOrderLogsByOrderId, getAllOrderLogs };
