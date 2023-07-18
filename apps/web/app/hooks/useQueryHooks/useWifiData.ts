'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

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

const url = 'http://localhost:8000/tools/wifi-details';
export const useWiFiData = () => {
  const wifiDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, WiFiDataResponse),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return wifiDataQuery;
};
