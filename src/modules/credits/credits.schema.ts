import { z } from 'zod';

export const createCreditSchema = z.object({
  body: z.object({
    client_id: z.string().uuid('Invalid client ID'),
    credit_amount: z.number().positive('Credit amount must be positive'),
    interest_rate: z.number().min(0).max(100, 'Interest rate must be between 0 and 100'),
    term_months: z.number().int().positive('Term months must be a positive integer'),
    registered_by: z.string().uuid('Invalid commercial ID').optional(),
  }),
});

export const getCreditsSchema = z.object({
  query: z.object({
    client_name: z.string().optional(),
    client_document: z.string().optional(),
    commercial_name: z.string().optional(),
    sort_by: z.enum(['created_at', 'credit_amount']).optional().default('created_at'),
    sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export type CreateCreditInput = z.infer<typeof createCreditSchema>['body'];
export type GetCreditsQuery = z.infer<typeof getCreditsSchema>['query'];
