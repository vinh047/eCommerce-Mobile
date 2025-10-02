import { PrismaClient } from '@prisma/client';

// Dùng biến global để cache instance trong môi trường DEV (HMR của Next.js)
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Chỉ gán vào global trong dev để tránh tạo nhiều instance
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;