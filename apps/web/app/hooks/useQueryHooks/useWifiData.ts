'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';

export const WiFiDataResponse = z.object({
  success: z.boolean(),
  data: z.object({
    signal: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    radioType: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.string(),
    }),
    channel: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    overall: z.union([
      z.literal('RELIABLE'),
      z.literal('DECENT'),
      z.literal('SLOW'),
    ]),
    description: z.string(),
    rating: z.union([z.literal('ok'), z.literal('warn'), z.literal('error')]),
  }),
});

const url = 'http://localhost:8000/tools/wifi-details';

export const useWiFiData = () => {
  const wifiDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, WiFiDataResponse),
    refetchOnMount: false,
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  return wifiDataQuery;
};
