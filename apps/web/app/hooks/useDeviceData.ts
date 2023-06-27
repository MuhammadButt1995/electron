'use client';

import { z } from 'zod';
import { shallow } from 'zustand/shallow';
import { useFetchData, DiskSpaceResponse } from '@/hooks/useFetchData';
import { useDiskSpaceStore } from '@/store/disk-space-store';

export const DeviceDataResponse = z.object({
  'Computer name': z.string(),
  RAM: z.string(),
  Manufacturer: z.string(),
  Model: z.string(),
  'Last boot time': z.string(),
  'Serial number': z.string(),
});

const ONE_DAY_IN_MS = 86400000;

export const useDeviceData = (method: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useFetchData(
      `http://127.0.0.1:8000/tools/execute/DeviceData/?method=${method}`,
      method === 'get_disk_usage' ? DiskSpaceResponse : DeviceDataResponse,
      false,
      method === 'get_disk_usage' ? ONE_DAY_IN_MS : false,
      false
    );

  const [status, description, diskData, lastUpdated] = useDiskSpaceStore(
    (state) => [
      state.status,
      state.description,
      state.diskData,
      state.lastUpdated,
    ],
    shallow
  );

  const deviceDataResponse = {
    data,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  const diskSpaceData = {
    status,
    description,
    diskData,
    lastUpdated,
  };

  if (method === 'get_disk_usage') {
    return { deviceDataResponse, diskSpaceData };
  }

  return { deviceDataResponse };
};
