import path from 'path';
import { createStore } from 'zustand/vanilla';
import { nativeImage, NativeImage } from 'electron';

type ConnectionState = 'connected' | 'not_connected' | 'error' | 'loading';

interface SubscribeFunction {
  (
    set: (fn: (state: StoreState) => Partial<StoreState>) => void,
    get: () => StoreState,
    api: any,
    unsubscribe: () => void
  ): void;
}

export interface StoreState {
  connectionState: ConnectionState;
  prevState: ConnectionState;
  icon: NativeImage;
  sublabel: string;
  updateState: (newState: Partial<StoreState>) => void;
  subscribers: SubscribeFunction[];
  subscribe: (fn: SubscribeFunction) => () => void;
  wasConnectedNowNotConnected: () => boolean;
}

export interface TrayState {
  icon: 'green' | 'yellow';
  setIcon: (icon: 'green' | 'yellow') => void;
}

export const trayStore = createStore<TrayState>((set) => ({
  icon: 'green',
  setIcon: (icon: 'green' | 'yellow') => set(() => ({ icon })),
}));

export const updateTrayStore = (newIcon: 'green' | 'yellow') => {
  trayStore.getState().setIcon(newIcon);
};

const initialState: Omit<
  StoreState,
  'updateState' | 'subscribers' | 'subscribe' | 'wasConnectedNowNotConnected'
> = {
  connectionState: 'loading',
  prevState: 'loading',
  icon: nativeImage.createFromPath(
    path.join(__dirname, '../assets/loading.png')
  ),
  sublabel: '',
};

const updateIcon = (connectionState: ConnectionState): NativeImage => {
  switch (connectionState) {
    case 'connected':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/check.png')
      );
    case 'not_connected':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/cross.png')
      );
    case 'error':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/warning.png')
      );
    case 'loading':
    default:
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      );
  }
};

const createStoreWithState = () =>
  createStore<StoreState>((set, get, api) => ({
    ...initialState,
    subscribers: [],
    updateState: (newState: Partial<StoreState>) => {
      if (newState.connectionState) {
        // eslint-disable-next-line no-param-reassign
        newState.icon = updateIcon(newState.connectionState);
      }
      set((state) => {
        // eslint-disable-next-line no-param-reassign
        newState.prevState = state.connectionState;
        return { ...state, ...newState };
      });
      get().subscribers.forEach((fn: SubscribeFunction) =>
        fn(set, get, api, () => {})
      );
    },
    subscribe: (fn: SubscribeFunction) => {
      get().subscribers.push(fn);
      return () => {
        set((state) => ({
          ...state,
          subscribers: state.subscribers.filter((f) => f !== fn),
        }));
      };
    },
    wasConnectedNowNotConnected: () => {
      const { prevState, connectionState } = get();
      return prevState === 'connected' && connectionState === 'not_connected';
    },
  }));

export const internetStore = createStoreWithState();
export const azureStore = createStoreWithState();
export const domainStore = createStoreWithState();

export const getInternetState = () => internetStore.getState();
export const getAzureState = () => azureStore.getState();
export const getDomainState = () => domainStore.getState();

export const checkAndUpdateIcon = () => {
  const internetState = getInternetState();
  const azureState = getAzureState();
  const domainState = getDomainState();

  let newIcon: 'green' | 'yellow' = 'green';
  if (
    internetState.connectionState !== 'connected' ||
    azureState.connectionState !== 'connected' ||
    domainState.connectionState !== 'connected'
  ) {
    newIcon = 'yellow';
  }

  updateTrayStore(newIcon);
};

export const updateInternetStore = (newState: Partial<StoreState>) => {
  internetStore.getState().updateState(newState);
  checkAndUpdateIcon();
};

export const updateAzureStore = (newState: Partial<StoreState>) => {
  azureStore.getState().updateState(newState);
  checkAndUpdateIcon();
};

export const updateDomainStore = (newState: Partial<StoreState>) => {
  domainStore.getState().updateState(newState);
  checkAndUpdateIcon();
};
