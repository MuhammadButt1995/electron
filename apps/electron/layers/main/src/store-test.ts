import path from 'path';
import { createStore } from 'zustand/vanilla';
import { nativeImage, NativeImage } from 'electron';

type ConnectionState = 'connected' | 'not_connected' | 'error' | 'loading';

export type ConnectionStoreState = {
  connectionState: ConnectionState;
  prevState: ConnectionState;
  icon: NativeImage;
  sublabel: string;
};

export type SubscribeFunction = {
  set: (
    fn: (state: ConnectionStoreState) => Partial<ConnectionStoreState>
  ) => void;
};

export type ConnectionStoreActions = {
  updateConnectionStoreState: (newState: Partial<ConnectionStoreState>) => void;
  wasConnectedNowNotConnected: () => boolean;
};
