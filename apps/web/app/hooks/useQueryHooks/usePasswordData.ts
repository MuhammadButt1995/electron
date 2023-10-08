'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

export const PasswordDataResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      daysLeft: z.string(),
      datetime: z.string(),
    }),
  })
);

const url = 'http://localhost:8567/tools/password-data';
const ONE_DAY_IN_MS = 86400000;

export const usePasswordData = () => {
  const passwordDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, PasswordDataResponse),
    refetchOnMount: false,
    refetchInterval: ONE_DAY_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return passwordDataQuery;
};
