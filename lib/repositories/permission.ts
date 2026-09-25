import prisma from './../../prisma/client';
import { handleError } from '@/utils/ErrorHandlingHelper';

// Repository for managing permissions in the database. Provides a method to create new permissions.
const createMany = (data: { name: string }[]) => {
  try {
    return prisma.permission.createMany({
      data: data.map(({ name }) => ({
        name,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
};

export const permission = {
  createMany,
};
