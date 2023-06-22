/* eslint-disable @typescript-eslint/naming-convention */

import { create } from 'zustand';
import { z } from 'zod';
import {
  useInternetStore,
  useADStore,
  useDomainStore,
} from '@/store/connection-store';

import { useWiFiStore } from './wifi-assistant-store';

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
    z.literal('not_connected'),
  ]),
});

const WiFiDetailsToolResponse = z.object({
  details: z.object({
    signal: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    link: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.string(),
    }),
    channel: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    overall: z.union([
      z.literal('reliable'),
      z.literal('decent'),
      z.literal('slow'),
    ]),
  }),
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

        window.onADStatusChange(useADStore.getState().status);
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

        window.onADStatusChange(useADStore.getState().status);
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
      } else {
        useDomainStore.getState().updateStatus('NOT CONNECTED');
        useDomainStore
          .getState()
          .updateDescription(
            'Please connect to either ZScaler ZPA or Citrix VPN to get onto a trusted network.'
          );
      }

      window.onDomainStatusChange(useDomainStore.getState().status);
    }

    if (url.includes('WiFiDetailsTool')) {
      const data = WiFiDetailsToolResponse.parse(jsonData);

      useWiFiStore.getState().updateData({ signal: data.details.signal.value });
      useWiFiStore.getState().updateData({ link: data.details.link.value });
      useWiFiStore
        .getState()
        .updateData({ channel: data.details.channel.value });

      if (data.details.overall === 'reliable') {
        useWiFiStore.getState().updateStatus('RELIABLE');
        useWiFiStore
          .getState()
          .updateDescription(
            'Your connection is stable and dependable for your work environment.'
          );
      } else if (data.details.overall === 'decent') {
        useWiFiStore.getState().updateStatus('DECENT');
        useWiFiStore
          .getState()
          .updateDescription(
            'Your connection is adequate for your work environment, however you may experience occasional slowdowns.'
          );
      } else {
        useWiFiStore.getState().updateStatus('SLOW');
        useWiFiStore
          .getState()
          .updateDescription(
            'Your connection may make it challenging to maintain a stable online presence.'
          );
      }
      window.onWiFiStatusChange(useWiFiStore.getState().status);
    }
  },
}));
