'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';
import { useGlobalStateStore } from '@/store/global-state-store';

const QualityEnum = z.union([
  z.literal('reliable'),
  z.literal('decent'),
  z.literal('slow'),
]);

const OverallEnum = z.union([
  z.literal('RELIABLE'),
  z.literal('DECENT'),
  z.literal('SLOW'),
]);

export const WiFiDataResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      signal: z.object({
        quality: QualityEnum,
        value: z.number(),
      }),
      radioType: z.object({
        quality: QualityEnum,
        value: z.string(),
      }),
      channel: z.object({
        quality: QualityEnum,
        value: z.number(),
      }),
      overall: OverallEnum,
    }),
  })
);

const url = 'http://localhost:8567/tools/wifi-details';
const FIVE_MINUTES_IN_MS = 300000;

export const useWiFiData = () => {
  const isDaaSMachine = useGlobalStateStore((state) => state.isDaaSMachine);
  const wifiDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, WiFiDataResponse),
    refetchInterval: FIVE_MINUTES_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    useErrorBoundary: true,
    networkMode: 'always',
    enabled: isDaaSMachine === false,
  });

  return wifiDataQuery;
};
