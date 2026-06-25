import { PrismaClient } from '../generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'prisma/dev.db');

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: `file:${DB_PATH}` });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma._prisma ?? (globalForPrisma._prisma = createPrismaClient());
