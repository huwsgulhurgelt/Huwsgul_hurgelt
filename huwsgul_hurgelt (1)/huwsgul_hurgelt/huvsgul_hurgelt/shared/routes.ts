import { z } from 'zod';
import { insertCarrierSchema, carriers } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  carriers: {
    list: {
      method: 'GET' as const,
      path: '/api/carriers',
      responses: {
        200: z.array(z.custom<typeof carriers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/carriers',
      input: insertCarrierSchema,
      responses: {
        201: z.custom<typeof carriers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/carriers/:id',
      // Schema requires pin + optional updates
      input: insertCarrierSchema.partial().extend({ pin: z.string() }),
      responses: {
        200: z.custom<typeof carriers.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'POST' as const, // Using POST for delete-with-body to be safe across all clients
      path: '/api/carriers/:id/delete',
      input: z.object({ pin: z.string() }),
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
