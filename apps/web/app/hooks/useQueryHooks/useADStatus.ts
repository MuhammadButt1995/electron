'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useOs } from '@mantine/hooks';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';

const IsBoundEnum = z.union([z.literal('BOUND'), z.literal('NOT BOUND')]);

export const ADStatusWindowsResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      azureAdJoined: z.boolean(),
      domainJoined: z.boolean(),
      isBound: IsBoundEnum,
    }),
  })
);

export const ADStatusMacResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      adBind: z.boolean(),
      isBound: IsBoundEnum,
    }),
  })
);
export type ADStatusResponse =
  | z.infer<typeof ADStatusWindowsResponse>
  | z.infer<typeof ADStatusMacResponse>;

export function isADStatusMacResponse(
  data: ADStatusResponse
): data is z.infer<typeof ADStatusMacResponse> {
  return 'adBind' in data;
}

export function isADStatusWindowsResponse(
  data: ADStatusResponse
): data is z.infer<typeof ADStatusWindowsResponse> {
  return 'azureAdJoined' in data;
}

const url = 'http://localhost:8567/tools/ad-status';

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
    refetchOnWindowFocus: false,
    refetchInterval: 900000,
    refetchIntervalInBackground: true,
    useErrorBoundary: true,
    networkMode: 'always',
    enabled: os !== 'undetermined',
  });

  return ADStatusQuery;
};
