/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import { shallow } from 'zustand/shallow';

import { useGlobalStateStore } from '@/store/global-state-store';
import { useTabStateStore } from '@/store/tab-state-store';

import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
import { useDiskSpace } from '@/hooks/useQueryHooks/useDiskData';
import { usePasswordData } from '@/hooks/useQueryHooks/usePasswordData';
import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import { useLastBootTime } from '@/hooks/useQueryHooks/useLastBootTime';
import { useBatteryHealth } from '@/hooks/useQueryHooks/useBatteryHealth';
import { useSSDHealth } from '@/hooks/useQueryHooks/useSSDHealth';

type Props = {
  children: React.ReactNode;
};

export const QueryRunner = ({ children }: Props) => {
  const [
    setDeviceStatus,
    setIdentityServicesStatus,
    setNetworkStatus,
    setInternetStatus,
    setEnterpriseStatus,
  ] = useTabStateStore(
    (state) => [
      state.setDeviceStatus,
      state.setIdentityServicesStatus,
      state.setNetworkStatus,
      state.setInternetStatus,
      state.setEnterpriseStatus,
    ],
    shallow
  );

  const [internetStatus, enterpriseStatus] = useTabStateStore(
    (state) => [state.internetStatus, state.enterpriseStatus],
    shallow
  );

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_ON_TRUSTED_NETWORK = useGlobalStateStore(
    (state) => state.isOnTrustedNetwork
  );

  const wifiQuery = useWiFiData();
  const networkQuery = useTrustedNetworkStatus();
  const adQuery = useADStatus();
  const passwordQuery = usePasswordData();
  const diskQuery = useDiskSpace();
  const lastBootQuery = useLastBootTime();
  const batteryHealthQuery = useBatteryHealth();
  const SSDHealthQuery = useSSDHealth();

  if (wifiQuery?.data?.data?.rating === 'ok' && IS_CONNECTED_TO_INTERNET) {
    setInternetStatus(true);
  } else {
    setInternetStatus(false);
  }

  if (networkQuery?.data?.data?.rating === 'ok') {
    setEnterpriseStatus(true);
  } else {
    setEnterpriseStatus(false);
  }

  if (internetStatus && enterpriseStatus) {
    setNetworkStatus(true);
  } else {
    setNetworkStatus(false);
  }

  if (
    adQuery?.data?.data?.rating === 'ok' &&
    passwordQuery?.data?.data?.rating === 'ok' &&
    IS_ON_TRUSTED_NETWORK
  ) {
    setIdentityServicesStatus(true);
  } else {
    setIdentityServicesStatus(false);
  }

  if (
    diskQuery?.data?.data?.rating === 'ok' &&
    lastBootQuery?.data?.data?.rating === 'ok' &&
    batteryHealthQuery?.data?.data.rating === 'ok' &&
    SSDHealthQuery?.data?.data.rating === 'ok'
  ) {
    setDeviceStatus(true);
  } else {
    setDeviceStatus(false);
  }

  return <>{children}</>;
};
