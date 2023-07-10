'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';

export const TrustedNetworkStatusResponse = z.object({
  success: z.boolean(),
  data: z.object({
    status: z.union([
      z.literal('ZPA'),
      z.literal('VPN'),
      z.literal('NOT CONNECTED'),
    ]),
    description: z.string(),
    rating: z.union([z.literal('ok'), z.literal('warn')]),
  }),
});

const url = 'http://localhost:8000/tools/trusted-network-status';

export const useTrustedNetworkStatus = () => {
  const trustedNetworkQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, TrustedNetworkStatusResponse),
    refetchOnMount: false,
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  return trustedNetworkQuery;
};
