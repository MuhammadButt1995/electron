/* eslint-disable @typescript-eslint/naming-convention */

import { create } from 'zustand';
import { z } from 'zod';
import {
  useInternetStore,
  useADStore,
  useDomainStore,
} from '@/store/connection-store';

// Define an interface for the state
interface WebSocketStoreState {
  sockets: { [url: string]: WebSocket };
  createSocket: (url: string) => void;
  closeSocket: (url: string) => void;
  handleMessage: (event: MessageEvent, url: string) => void;
}

const ServerErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

const InternetConnectionToolResponse = z.object({
  is_connected: z.boolean(),
});

const ADConnectionToolWindowsResponse = z.object({
  azure_ad_joined: z.boolean(),
  domain_joined: z.boolean(),
  is_connected: z.boolean(),
});

const ADConnectionToolMacResponse = z.object({
  ad_bind: z.boolean(),
  is_connected: z.boolean(),
});

const DomainConnectionToolResponse = z.object({
  is_connected: z.boolean(),
  status_message: z.union([
    z.literal('ZPA'),
    z.literal('VPN'),
    z.literal('no_internet'),
    z.literal('not_connected'),
  ]),
});

// Define a store for the WebSocket connection
export const useWebSocketStore = create<WebSocketStoreState>((set, get) => ({
  sockets: {},
  createSocket: (url) => {
    if (get().sockets[url]) {
      return;
    }

    const socket = new WebSocket(url);
    set((state) => ({ sockets: { ...state.sockets, [url]: socket } }));

    socket.addEventListener('open', (event) => {
      console.log(`Connected to ${url}`);
    });

    socket.addEventListener('close', (event) => {
      console.log(`Disconnected from ${url}`);
      set((state) => {
        const { [url]: _, ...remainingSockets } = state.sockets;
        return { sockets: remainingSockets };
      });
    });

    socket.addEventListener('message', (event) => {
      get().handleMessage(event, url);
    });
  },
  closeSocket: (url) => {
    get().sockets[url]?.close();
    set((state) => {
      const { [url]: _, ...remainingSockets } = state.sockets;
      return { sockets: remainingSockets };
    });
  },
  handleMessage: (event, url) => {
    console.log(event.data);
    const jsonData = JSON.parse(event.data);
    const isServerError = ServerErrorResponse.safeParse(jsonData).success;

    if (isServerError) {
      useInternetStore.getState().updateStatus('ERROR');
      useInternetStore
        .getState()
        .updateDescription(
          'We ran into an issue. Please relaunch the Talos server and try again.'
        );
      return;
    }

    if (url.includes('InternetConnectionTool')) {
      const data = InternetConnectionToolResponse.parse(jsonData);

      if (data.is_connected) {
        useInternetStore.getState().updateStatus('CONNECTED');
        useInternetStore
          .getState()
          .updateDescription('You are connected to the Internet.');
      } else {
        useInternetStore.getState().updateStatus('NOT CONNECTED');
        useInternetStore
          .getState()
          .updateDescription('You are not connected to the Internet.');
      }

      window.onInternetStatusChange({
        status: useInternetStore.getState().status,
        description: useInternetStore.getState().description,
      });
    }

    if (url.includes('ADConnectionTool')) {
      if (window.navigator.userAgent.indexOf('Mac') !== -1) {
        const data = ADConnectionToolMacResponse.parse(jsonData);

        if (data.is_connected) {
          useADStore.getState().updateStatus('CONNECTED');
          useADStore
            .getState()
            .updateDescription(
              'You machine is bound to On-Prem Active Directory.'
            );
        } else {
          useADStore.getState().updateStatus('NOT CONNECTED');
          useADStore
            .getState()
            .updateDescription(
              'Your machine is not bound to On-Prem Active Directory.'
            );
        }

        window.onADStatusChange({
          status: useADStore.getState().status,
          description: useADStore.getState().description,
        });
      } else {
        const data = ADConnectionToolWindowsResponse.parse(jsonData);

        if (data.is_connected) {
          useADStore.getState().updateStatus('CONNECTED');
          useADStore
            .getState()
            .updateDescription(
              'Your machine is domain joined and bound to Azure AD.'
            );
        } else {
          useADStore.getState().updateStatus('NOT CONNECTED');
          useADStore
            .getState()
            .updateDescription(
              'Your machine is either not domain joined or not bound to Azure AD.'
            );
        }

        window.onADStatusChange({
          status: useADStore.getState().status,
          description: useADStore.getState().description,
        });
      }
    }

    if (url.includes('DomainConnectionTool')) {
      const data = DomainConnectionToolResponse.parse(jsonData);

      if (data.status_message === 'ZPA') {
        useDomainStore.getState().updateStatus('CONNECTED');
        useDomainStore
          .getState()
          .updateDescription('You are connected to ZPA.');
      } else if (data.status_message === 'VPN') {
        useDomainStore.getState().updateStatus('CONNECTED');
        useDomainStore
          .getState()
          .updateDescription('You are connected to VPN.');
      } else if (data.status_message === 'no_internet') {
        useDomainStore.getState().updateStatus('ERROR');
        useDomainStore
          .getState()
          .updateDescription('Internet required for trusted network status.');
      } else {
        useDomainStore.getState().updateStatus('NOT CONNECTED');
        useDomainStore
          .getState()
          .updateDescription(
            'You are not connected to either ZScaler ZPA or VPN.'
          );
      }

      window.onDomainStatusChange({
        status: useDomainStore.getState().status,
        description: useDomainStore.getState().description,
      });
    }
  },
}));
