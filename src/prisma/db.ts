import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d.js';
import contractJson from './contract.json' with { type: 'json' };

export const contract = contractFromJson<Contract>(contractJson);

// export const db = postgres({
//   contract,
//   url: process.env['DATABASE_URL']!,
// });

const createDb = () =>
  postgres({
    contract,
    url: process.env['DATABASE_URL']!,
  });

type DbClient = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as {
  __db: DbClient | undefined;
};

export const db = globalForDb.__db ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__db = db;
}
