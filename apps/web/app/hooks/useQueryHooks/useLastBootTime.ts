'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

export const LastBootTimeResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      lastBootTime: z.string(),
      daysSinceBoot: z.string(),
    }),
  })
);

const url = 'http://localhost:8000/tools/last-boottime';
const ONE_DAY_IN_MS = 86400000;

export const useLastBootTime = () => {
  const lastBootTimeQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, LastBootTimeResponse),
    refetchOnMount: false,
    refetchInterval: ONE_DAY_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return lastBootTimeQuery;
};
