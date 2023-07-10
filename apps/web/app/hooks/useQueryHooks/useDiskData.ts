'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';

export const DiskSpaceResponse = z.object({
  success: z.boolean(),
  data: z.object({
    totalDiskSize: z.string(),
    currentDiskUsage: z.string(),
    remainingDiskSpace: z.string(),
    diskSpaceUsage: z.union([
      z.literal('LOW'),
      z.literal('MEDIUM'),
      z.literal('HIGH'),
    ]),
    description: z.string(),
    rating: z.union([z.literal('ok'), z.literal('warn'), z.literal('error')]),
  }),
});

const url = 'http://localhost:8000/tools/disk-usage';
const ONE_HOUR_IN_MS = 3600000;

export const useDiskSpace = () => {
  const diskSpaceQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, DiskSpaceResponse),
    refetchOnMount: false,
    refetchInterval: ONE_HOUR_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  return diskSpaceQuery;
};
