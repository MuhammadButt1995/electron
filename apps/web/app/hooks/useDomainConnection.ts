'use client';

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useDomainStore } from '@/store/connection-store';
import { useWebSocketStore } from '@/store/socket-store';

export const useDomainConnection = () => {
  const [status, description] = useDomainStore(
    (state) => [state.status, state.description],
    shallow
  );

  useEffect(() => {
    useWebSocketStore
      .getState()
      .createSocket('ws://127.0.0.1:8000/tools/DomainConnectionTool/ws');
    // Do not close the WebSocket connection when the component unmounts
  }, []);

  return { status, description };
};
