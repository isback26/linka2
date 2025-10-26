import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"], // 필요하면 "query" 도 가능
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
