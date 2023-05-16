import path from 'path';
import { createStore } from 'zustand/vanilla';
import { nativeImage, NativeImage } from 'electron';

type ConnectionState = 'connected' | 'not_connected' | 'error' | 'loading';

export interface StoreState {
  connectionState: ConnectionState;
  icon: NativeImage;
  sublabel: string;
  updateState: (newState: Partial<StoreState>) => void;
}

const initialState: Omit<StoreState, 'updateState'> = {
  connectionState: 'loading',
  icon: nativeImage.createFromPath(
    path.join(__dirname, '../assets/loading.png')
  ),
  sublabel: '', // Initialize sublabel
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
  createStore<StoreState>((set) => ({
    ...initialState,
    updateState: (newState: Partial<StoreState>) => {
      if (newState.connectionState) {
        // eslint-disable-next-line no-param-reassign
        newState.icon = updateIcon(newState.connectionState);
      }
      set((state) => ({ ...state, ...newState }));
    },
  }));

export const internetStore = createStoreWithState();
export const azureStore = createStoreWithState();
export const domainStore = createStoreWithState();

export const updateInternetStore = (newState: Partial<StoreState>) => {
  console.log('Updating Internet Store with: ', newState);
  internetStore.getState().updateState(newState);
};

export const updateAzureStore = (newState: Partial<StoreState>) => {
  console.log('Updating Azure Store with: ', newState);
  azureStore.getState().updateState(newState);
};

export const updateDomainStore = (newState: Partial<StoreState>) => {
  console.log('Updating Domain Store with: ', newState);
  domainStore.getState().updateState(newState);
};

// Export getters for state
export const getInternetState = () => internetStore.getState();
export const getAzureState = () => azureStore.getState();
export const getDomainState = () => domainStore.getState();
