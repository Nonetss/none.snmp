import { Scalar } from '@scalar/hono-api-reference';
import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Handler } from 'hono';
import { sendExcel } from '@/lib/excel';
import { count } from 'drizzle-orm';
import { db } from '@/core/config';
import { authUser } from '@/db';
import { auth } from '@/lib/auth';
import { logger as pinoLogger } from '@/lib/logger';

import apiRouter from '@/api';
import { initScheduler } from '@/core/services/scheduler.service';
import { seedMetrics } from '@/lib/snmp/seed';
import { seedDefaultTasks } from '@/lib/snmp/seedTasks';

const app = new OpenAPIHono();

app.use('*', cors());
app.use('*', logger());

app.use('*', async (c, next) => {
  await next();
  if (c.req.query('excel') === 'true' && c.res.status === 200) {
    const contentType = c.res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await c.res.clone().json();
        const exportData = Array.isArray(data) ? data : [data];
        const filename =
          c.req.path.split('/').filter(Boolean).pop() || 'export';
        c.res = await sendExcel(c, exportData, filename);
      } catch (err) {
        console.error('[Excel Middleware] Error converting to excel:', err);
      }
    }
  }
});

const rootSchema = z.object({
  message: z.string().openapi({ example: 'Hello, World!' }),
});

const rootRoute = createRoute({
  method: 'get',
  path: '/api/health',
  summary: 'Health check',
  description: 'Health check',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: rootSchema,
        },
      },
      description: 'Root endpoint',
    },
  },
});

const rootHandler: Handler = (c) => {
  return c.json({ message: 'Hello, World!' });
};

app.openapi(rootRoute, rootHandler);

// Better Auth routes - debe estar antes de otras rutas /api para que funcione correctamente
app.on(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/api/auth/*', async (c) => {
  return auth.handler(c.req.raw);
});

app.route('/api', apiRouter);

async function seedAdminUser() {
  try {
    pinoLogger.info('[Auth Seed] Checking for existing users...');
    const result = await db.select({ value: count() }).from(authUser);
    const userCount = Number(result[0].value);

    pinoLogger.info(`[Auth Seed] Current user count: ${userCount}`);

    if (userCount === 0) {
      const adminEmail = 'admin@admin.com';
      const adminPassword = Math.random().toString(36).slice(-10);
      const adminName = 'Admin User';

      pinoLogger.info(
        '[Auth Seed] No users found. Generating admin account...',
      );

      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      console.log('\n' + '█'.repeat(60));
      console.log('█' + ' '.repeat(58) + '█');
      console.log(
        '█   ADMIN USER AUTOMATICALLY CREATED' + ' '.repeat(23) + '█',
      );
      console.log('█' + ' '.repeat(58) + '█');
      console.log(`█   Email:    ${adminEmail.padEnd(44)} █`);
      console.log(`█   Password: ${adminPassword.padEnd(44)} █`);
      console.log('█' + ' '.repeat(58) + '█');
      console.log('█'.repeat(60) + '\n');

      pinoLogger.info(
        {
          adminEmail,
        },
        '[Auth Seed] Admin user created successfully',
      );
    } else {
      pinoLogger.info(
        '[Auth Seed] Users already exist, skipping admin generation.',
      );
    }
  } catch (err) {
    pinoLogger.error(
      {
        err,
      },
      '[Auth Seed] Failed to check or seed admin user',
    );
  }
}

// Initial database seeding
async function initialize() {
  try {
    const mibs = await seedMetrics();
    pinoLogger.info(`[Seed] Successfully seeded ${mibs.length} MIBs`);

    await seedDefaultTasks();

    // Seed admin user if needed
    await seedAdminUser();

    // Initialize background scheduler
    await initScheduler();
  } catch (err) {
    pinoLogger.error(
      {
        err,
      },
      '[Seed] Critical error during initialization',
    );
  }
}

initialize();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'NONE.SNMP',
  },
});

app.get('/scalar', Scalar({ url: '/doc' }));

Bun.serve({ port: 3000, fetch: app.fetch, idleTimeout: 0 });
