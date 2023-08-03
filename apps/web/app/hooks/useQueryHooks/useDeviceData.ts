'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { SucessfulAPIResponseSchema } from '@/types/api';

export const DeviceDataResponse = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      computerName: z.string(),
      ram: z.string(),
      manufacturer: z.string(),
      model: z.string(),
      serialNumber: z.string(),
    }),
  })
);

const url = 'http://localhost:8000/tools/device-data';

export const useDeviceData = () => {
  const deviceDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, DeviceDataResponse),
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  return deviceDataQuery;
};
