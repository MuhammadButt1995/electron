/* eslint-disable no-nested-ternary */

'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { shallow } from 'zustand/shallow';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import {
  useGlobalStateStore,
  TrustedNetworkType,
} from '@/store/global-state-store';
import { FmInfoAPIResponseSchema } from '@/types/api';

export const TrustedNetworkStatusResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      status: z.union([
        z.literal('ZPA'),
        z.literal('VPN'),
        z.literal('DISCONNECTED'),
      ]),
    }),
  })
);

const url = 'http://localhost:8000/tools/trusted-network-status';

export const useTrustedNetworkStatus = () => {
  const [updateIsOnTrustedNetwork, updateTrustedNetworkType] =
    useGlobalStateStore(
      (state) => [
        state.updateIsOnTrustedNetwork,
        state.updateTrustedNetworkType,
      ],
      shallow
    );

  const trustedNetworkQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, TrustedNetworkStatusResponse),
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    useErrorBoundary: true,
    networkMode: 'always',
  });

  const trustedNetworkStatusResponse: TrustedNetworkType =
    trustedNetworkQuery.isSuccess
      ? trustedNetworkQuery.data.data.status !== 'DISCONNECTED'
        ? trustedNetworkQuery.data.data.status
        : undefined
      : undefined;

  const TRUSTED_NETWORK_TYPE = trustedNetworkStatusResponse;

  const IS_ON_TRUSTED_NETWORK =
    TRUSTED_NETWORK_TYPE === 'ZPA' || TRUSTED_NETWORK_TYPE === 'VPN';

  useEffect(() => {
    updateIsOnTrustedNetwork(IS_ON_TRUSTED_NETWORK);
    updateTrustedNetworkType(TRUSTED_NETWORK_TYPE);
  }, [
    IS_ON_TRUSTED_NETWORK,
    TRUSTED_NETWORK_TYPE,
    updateIsOnTrustedNetwork,
    updateTrustedNetworkType,
  ]);

  return trustedNetworkQuery;
};
