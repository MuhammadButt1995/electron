'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

const DiskSpaceUsageEnum = z.enum(['HEALTHY', 'SUBOPTIMAL', 'AT RISK']);

// DiskSpaceResponse schema
export const DiskSpaceResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      totalDiskSize: z.string(),
      currentDiskUsage: z.string(),
      remainingDiskSpace: z.string(),
      diskUtilizationHealth: DiskSpaceUsageEnum,
    }),
  })
);

const url = 'http://localhost:8567/tools/disk-usage';
const ONE_HOUR_IN_MS = 3600000;

export const useDiskSpace = () => {
  const diskSpaceQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, DiskSpaceResponse),
    refetchOnMount: false,
    refetchInterval: ONE_HOUR_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return diskSpaceQuery;
};
