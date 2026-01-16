import type { RouteHandler } from '@hono/zod-openapi';
import type { getNpmAuthRoute } from '@/api/v0/proxy/npm/auth/get/get.route';
import { db } from '@/core/config';

export const getNpmAuthHandler: RouteHandler<typeof getNpmAuthRoute> = async (
  c,
) => {
  try {
    const auth = await db.query.npmAuthTable.findMany();
    const metadata = {
      exists: auth.length > 0,
      total: auth.length,
    };
    return c.json({ auth, metadata }, 200);
  } catch (error) {
    console.error('[NPM Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
