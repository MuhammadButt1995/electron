'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { SucessfulAPIResponseSchema } from '@/types/api';

export const DomainDataResponse = SucessfulAPIResponseSchema.and(
  z.object({
    data: z.object({
      loggedOnDomain: z.string(),
      loggedOnUser: z.string(),
      lastLogonTime: z.string(),
    }),
  })
);

const url = 'http://localhost:8000/tools/domain-data';

export const useDomainData = () => {
  const domainDataQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, DomainDataResponse),
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    useErrorBoundary: true,
    networkMode: 'online',
  });

  return domainDataQuery;
};
