import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prismaClient = () => {
  return new PrismaClient({
    adapter: adapter,
  });
};
//This is a singleton instance of Prisma Client. It is used to ensure that there is only one instance of Prisma Client throughout the application. This is important because Prisma Client maintains a connection pool to the database, and having multiple instances can lead to connection issues given Next.js's hot-reloading in development.
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? prismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
