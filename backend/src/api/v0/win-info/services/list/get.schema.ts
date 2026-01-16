import { z } from '@hono/zod-openapi';

export const getServiceNamesQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getServiceNamesResponseSchema = z.array(z.string());
