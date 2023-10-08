'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { SucessfulAPIResponseSchema } from '@/types/api';
import { TrustedNetworkType } from '@/store/global-state-store';

export const NetworkSpeedResponse = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      downloadSpeed: z.string(),
      uploadSpeed: z.string(),
      ping: z.string(),
    }),
  })
);

export const useNetworkSpeed = (networkType: TrustedNetworkType) => {
  const url = `http://localhost:8567/tools/network-speed?is_on_vpn=${
    networkType === 'VPN'
  }`;
  const networkSpeedQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, NetworkSpeedResponse),
    enabled: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return networkSpeedQuery;
};
