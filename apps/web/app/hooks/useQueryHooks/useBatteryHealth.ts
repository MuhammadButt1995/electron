'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

export const BatteryHealthResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      batteryHealthStatus: z.string(),
      batteryHealthPercentage: z.string(),
      batteryChargePercentage: z.string(),
      isPlugged: z.boolean(),
    }),
  })
);

const url = 'http://localhost:8567/tools/battery-health';
const ONE_DAY_IN_MS = 86400000;

export const useBatteryHealth = () => {
  const isDaaSMachine = window.meta.isOnDaas();
  const batteryHealthQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, BatteryHealthResponse),
    refetchOnMount: false,
    refetchInterval: ONE_DAY_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
    enabled: !isDaaSMachine,
  });

  return batteryHealthQuery;
};
