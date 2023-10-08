'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { SucessfulAPIResponseSchema } from '@/types/api';

export const DaaSStatusResponse = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      isOnDaas: z.boolean(),
    }),
  })
);

const url = 'http://localhost:8567/tools/daas-status';

export const useDaaSStatus = () => {
  const daasStatusQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, DaaSStatusResponse),

    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return daasStatusQuery;
};
