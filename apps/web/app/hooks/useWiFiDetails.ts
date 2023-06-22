'use client';

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useWiFiStore } from '@/store/wifi-assistant-store';
import { useWebSocketStore } from '@/store/socket-store';

export const useWiFiDetails = () => {
  const [status, description, data] = useWiFiStore(
    (state) => [state.status, state.description, state.data],
    shallow
  );

  useEffect(() => {
    useWebSocketStore
      .getState()
      .createSocket('ws://127.0.0.1:8000/tools/WiFiDetailsTool/ws');
    // Do not close the WebSocket connection when the component unmounts
  }, []);

  return { status, description, data };
};
