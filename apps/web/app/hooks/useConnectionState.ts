import { useState } from 'react';

import useMounted from './useMounted';

export type ConnectionState =
  | 'connected'
  | 'not_connected'
  | 'error'
  | 'loading';

export type ConnectionMessage = {
  connectionState: ConnectionState;
  sublabel: string;
};

export type ConnectionTool = 'internet' | 'ad' | 'domain';

const useConnectionState = (tool: ConnectionTool) => {
  const { mounted } = useMounted();
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('loading');
  const [connectionLabel, setConnectionLabel] = useState('');

  if (mounted) {
    switch (tool) {
      case 'internet':
        window.onInternetStateChanged((_event, value: ConnectionMessage) => {
          setConnectionState(value.connectionState);
          setConnectionLabel(value.sublabel);
        });
        break;
      case 'ad':
        window.onADStateChanged((_event, value: ConnectionMessage) => {
          setConnectionState(value.connectionState);
          setConnectionLabel(value.sublabel);
        });
        break;
      case 'domain':
        window.onDomainStateChanged((_event, value: ConnectionMessage) => {
          setConnectionState(value.connectionState);
          setConnectionLabel(value.sublabel);
        });
        break;
      default:
        break;
    }
  }

  return { connectionState, connectionLabel };
};

export default useConnectionState;
