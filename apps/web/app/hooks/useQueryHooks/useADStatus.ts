'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useOs } from '@mantine/hooks';
import { fetchAndParseData } from '@/lib/fetchAndParseData';

export const ADStatusWindowsResponse = z.object({
  azureAdJoined: z.boolean(),
  domainJoined: z.boolean(),
  isBound: z.union([z.literal('BOUND'), z.literal('NOT BOUND')]),
  description: z.string(),
  rating: z.union([z.literal('ok'), z.literal('error')]),
});

export const ADStatusMacResponse = z.object({
  ad_bind: z.boolean(),
  isBound: z.union([z.literal('BOUND'), z.literal('NOT BOUND')]),
  description: z.string(),
  rating: z.union([z.literal('ok'), z.literal('error')]),
});

export type ADStatusResponse =
  | z.infer<typeof ADStatusWindowsResponse>
  | z.infer<typeof ADStatusMacResponse>;

export function isADStatusMacResponse(
  data: ADStatusResponse
): data is z.infer<typeof ADStatusMacResponse> {
  return 'ad_bind' in data;
}

export function isADStatusWindowsResponse(
  data: ADStatusResponse
): data is z.infer<typeof ADStatusWindowsResponse> {
  return 'azureAdJoined' in data;
}

const url = 'http://localhost:8000/tools/ad-status';

export const useADStatus = () => {
  const os = useOs();

  const ADStatusQuery = useQuery<ADStatusResponse, Error>({
    queryKey: [url],
    queryFn: () =>
      fetchAndParseData(
        url,
        os === 'macos' ? ADStatusMacResponse : ADStatusWindowsResponse
      ),
    refetchOnMount: false,
    refetchInterval: 600000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  return ADStatusQuery;
};
