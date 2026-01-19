import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/core/config';
import { authSession, authAccount, authVerification, authUser } from '@/db';

// Configurar better-auth con el adaptador de Drizzle
// Mapeamos los nombres de las tablas para que better-auth las reconozca
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authUser, // better-auth busca "user"
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4321',
  secret: process.env.BETTER_AUTH_SECRET || 'change-me-in-production',
});
