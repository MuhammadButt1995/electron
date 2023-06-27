'use client';

import { shallow } from 'zustand/shallow';
import { useOs } from '@mantine/hooks';
import {
  useFetchData,
  ADStatusMacResponse,
  ADStatusWindowsResponse,
} from '@/hooks/useFetchData';
import { useADStore } from '@/store/connection-store';

export const useADStatus = () => {
  const os = useOs();

  const { isLoading, isFetching, isSuccess, isError, refetch } = useFetchData(
    'http://127.0.0.1:8000/tools/execute/ADStatus/',
    os === 'macos' ? ADStatusMacResponse : ADStatusWindowsResponse,
    false,
    600000,
    false
  );

  const [status, description, lastUpdated] = useADStore(
    (state) => [state.status, state.description, state.lastUpdated],
    shallow
  );

  const ADResponse = {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  const ADState = {
    status,
    description,
    lastUpdated,
  };

  return { ADResponse, ADState };
};
