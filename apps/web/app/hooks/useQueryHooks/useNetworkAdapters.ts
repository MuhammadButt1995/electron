'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { SucessfulAPIResponseSchema } from '@/types/api';

export const NetworkAdaptersResponse = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      activeAdapters: z.record(z.string()),
      inactiveAdapters: z.record(z.string()),
    }),
  })
);

const url = 'http://localhost:8000/tools/network-adapters';

export const useNetworkAdapters = () => {
  const networkResponseQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, NetworkAdaptersResponse),
    enabled: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: 'always',
    useErrorBoundary: true,
  });

  return networkResponseQuery;
};
