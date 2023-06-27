import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ConnectionState = {
  status: 'LOADING' | 'CONNECTED' | 'NOT CONNECTED' | 'ERROR';
  description?: string;
  lastUpdated: string;
};

export type ConnectionAction<T extends ConnectionState> = {
  updateStatus: (status: T['status']) => void;
  updateDescription: (description: T['description']) => void;
  updateLastUpdated: (lastUpdated: T['lastUpdated']) => void;
};

function createConnectionStore(name: string) {
  return create<ConnectionState & ConnectionAction<ConnectionState>>()(
    persist(
      (set) => ({
        status: 'LOADING',
        description: '',
        lastUpdated: dayjs().format('ddd, MMM D, YYYY h:mm A'),
        updateStatus: (status) => set(() => ({ status })),
        updateDescription: (description) => set(() => ({ description })),
        updateLastUpdated: (lastUpdated) => set(() => ({ lastUpdated })),
      }),
      {
        name: `${name}-storage`,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
}

export const useInternetStore = createConnectionStore('internet');
export const useADStore = createConnectionStore('ad');
export const useTrustedNetworkStore = createConnectionStore('trusted-network');
