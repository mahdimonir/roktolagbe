import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../config/env';

// Use a connection pool — more efficient and stable than a single connection
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,               // max pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool as any);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
