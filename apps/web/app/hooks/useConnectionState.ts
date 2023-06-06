import { useState, useEffect } from 'react';

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
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('loading');
  const [connectionLabel, setConnectionLabel] = useState('');

  useEffect(() => {
    const events = {
      internet: 'onInternetStateChanged',
      ad: 'onADStateChanged',
      domain: 'onDomainStateChanged',
    };

    window[events[tool]]((_event, value: ConnectionMessage) => {
      setConnectionState(value.connectionState);
      setConnectionLabel(value.sublabel);
    });
  }, [tool]);

  return { connectionState, connectionLabel };
};

export default useConnectionState;
