'use client';

import { shallow } from 'zustand/shallow';
import { useWiFiStore } from '@/store/wifi-assistant-store';
import { useFetchData, WiFiDataResponse } from '@/hooks/useFetchData';

export const useWiFiDetails = () => {
  const { isLoading, isFetching, isSuccess, isError, refetch } = useFetchData(
    'http://127.0.0.1:8000/tools/execute/WifiData/',
    WiFiDataResponse,
    false,
    300000,
    false
  );

  const [status, description, data, lastUpdated] = useWiFiStore(
    (state) => [state.status, state.description, state.data, state.lastUpdated],
    shallow
  );

  const wifiResponse = {
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  const wifiState = {
    status,
    description,
    data,
    lastUpdated,
  };

  return { wifiResponse, wifiState };
};
