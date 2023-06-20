'use client';

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useADStore } from '@/store/connection-store';
import { useWebSocketStore } from '@/store/socket-store';

export const useADConnection = () => {
  const [status, description] = useADStore(
    (state) => [state.status, state.description],
    shallow
  );

  useEffect(() => {
    useWebSocketStore
      .getState()
      .createSocket('ws://127.0.0.1:8000/tools/ADConnectionTool/ws');
    // Do not close the WebSocket connection when the component unmounts
  }, []);

  return { status, description };
};
