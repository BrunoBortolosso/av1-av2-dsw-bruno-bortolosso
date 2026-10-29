require('dotenv/config');

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const databasePath = databaseUrl.startsWith('file:') ? databaseUrl.slice(5) : databaseUrl;
const adapter = new PrismaBetterSqlite3({ url: databasePath });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
