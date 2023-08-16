import { z } from 'zod';
import { ErrorAPIResponseSchema } from '@/types/api';
import {
  TalosServerDownError,
  UnsuccessfulTalosServerRequest,
  UnsuccessfulZodParsingError,
  NetworkResponseError,
} from './exceptions';

export async function fetchAndParseData<T extends z.ZodType<any, any>>(
  url: string,
  schema: T
): Promise<T['_type']> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new NetworkResponseError();
    }

    const data = await response.json();
    const errorResult = ErrorAPIResponseSchema.safeParse(data);

    if (errorResult.success) {
      throw new UnsuccessfulTalosServerRequest({
        cause: errorResult.data.error,
      });
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      throw new UnsuccessfulZodParsingError(url);
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new TalosServerDownError();
    } else {
      throw error;
    }
  }
}
