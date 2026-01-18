import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from '@/db/relations';

// Validar que DATABASE_URL esté definida
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL no está definida. Por favor, configura la variable de entorno DATABASE_URL.',
  );
}

export const db = drizzle(databaseUrl, {
  relations,
});
