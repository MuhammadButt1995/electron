import { z } from 'zod';

export const SucessfulAPIResponseSchema = z.object({
  success: z.literal(true),
  timestamp: z.string(),
});

export const ErrorAPIResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  timestamp: z.string(),
});

export type ErrorAPIResponse = z.infer<typeof ErrorAPIResponseSchema>;
export type SuccessfulAPIResponse = z.infer<typeof SucessfulAPIResponseSchema>;

export const RatingEnum = z.enum(['ok', 'warn', 'error']);

export const FmInfoAPIResponseSchema = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      rating: RatingEnum,
      description: z.string(),
    }),
  })
);

export type FminfoAPIResponse = z.infer<typeof FmInfoAPIResponseSchema>;
