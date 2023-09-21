'use client';

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useNetwork, useOs } from '@mantine/hooks';
import { useGlobalStateStore } from '@/store/global-state-store';

const useInitialStates = () => {
  const [updateIsConnectedToInternet, updateInternetConnectionType] =
    useGlobalStateStore(
      (state) => [
        state.updateIsConnectedToInternet,
        state.updateInternetConnectionType,
      ],
      shallow
    );

  const updateOS = useGlobalStateStore((state) => state.updateOS);

  const NETWORK_DATA = useNetwork();
  const INTERNET_CONNECTION = NETWORK_DATA.type;
  const IS_CONNECTED_TO_INTERNET = NETWORK_DATA.online;

  const GET_OS = useOs() === 'macos' ? 'macos' : 'windows';
  const GET_INTERNET_CONNECTION_TYPE =
    INTERNET_CONNECTION === 'wifi' ? 'wifi' : 'ethernet';

  const internetConnectionValue = IS_CONNECTED_TO_INTERNET
    ? 'CONNECTED'
    : 'NOT CONNECTED';

  useEffect(() => {
    updateOS(GET_OS);
  }, [updateOS, GET_OS]);

  useEffect(() => {
    updateIsConnectedToInternet(IS_CONNECTED_TO_INTERNET);
    updateInternetConnectionType(GET_INTERNET_CONNECTION_TYPE);
  }, [
    GET_INTERNET_CONNECTION_TYPE,
    IS_CONNECTED_TO_INTERNET,
    updateInternetConnectionType,
    updateIsConnectedToInternet,
  ]);
};

export default useInitialStates;
