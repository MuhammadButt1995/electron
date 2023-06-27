'use client';

import { z } from 'zod';
import { useFetchData } from '@/hooks/useFetchData';

export const NetworkAdaptersResponse = z.object({
  active_adapters: z.record(z.string()),
  inactive_adapters: z.record(z.string()),
});

export const useNetworkAdapters = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useFetchData(
      'http://127.0.0.1:8000/tools/execute/NetworkAdapters/',
      NetworkAdaptersResponse,
      false,
      false,
      false
    );

  const networkAdaptersResponse = {
    data,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  return { networkAdaptersResponse };
};
