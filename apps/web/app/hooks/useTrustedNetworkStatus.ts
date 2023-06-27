'use client';

import { shallow } from 'zustand/shallow';
import {
  useFetchData,
  TrustedNetworkStatusResponse,
} from '@/hooks/useFetchData';
import { useTrustedNetworkStore } from '@/store/connection-store';

export const useTrustedNetworkStatus = () => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useFetchData(
      'http://127.0.0.1:8000/tools/execute/TrustedNetworkStatus/',
      TrustedNetworkStatusResponse,
      false,
      300000,
      false
    );

  const [status, description, lastUpdated] = useTrustedNetworkStore(
    (state) => [state.status, state.description, state.lastUpdated],
    shallow
  );

  const trustedNetworkResponse = {
    data,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  const trustedNetworkState = {
    status,
    description,
    lastUpdated,
  };

  return { trustedNetworkResponse, trustedNetworkState };
};
