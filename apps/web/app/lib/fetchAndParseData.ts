import { z } from 'zod';

export async function fetchAndParseData<T extends z.ZodType<any, any>>(
  url: string,
  schema: T
): Promise<T['_type']> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return schema.parse(data);
}
