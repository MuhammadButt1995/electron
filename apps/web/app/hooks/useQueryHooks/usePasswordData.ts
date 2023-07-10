'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';

export const PasswordDataResponse = z.object({
  success: z.boolean(),
  data: z.object({
    daysLeft: z.string(),
    datetime: z.string(),
    description: z.string(),
    rating: z.union([z.literal('ok'), z.literal('warn'), z.literal('error')]),
  }),
});

const url = 'http://localhost:8000/tools/password-data';
const ONE_DAY_IN_MS = 86400000;

export const usePasswordData = () => {
  const passwordDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, PasswordDataResponse),
    refetchOnMount: false,
    refetchInterval: ONE_DAY_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  return passwordDataQuery;
};
