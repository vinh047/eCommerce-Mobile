import { PrismaClient } from '@prisma/client';

// Khai báo kiểu cho biến global (để TS hiểu)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Chỉ cache ở DEV để tránh tạo nhiều instance khi HMR
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
