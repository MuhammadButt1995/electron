import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ConnectionState = {
  status: 'LOADING' | 'CONNECTED' | 'NOT CONNECTED' | 'ERROR';
  description?: string;
};

export type ConnectionAction<T extends ConnectionState> = {
  updateStatus: (status: T['status']) => void;
  updateDescription: (description: T['description']) => void;
};

function createConnectionStore(name: string) {
  return create<ConnectionState & ConnectionAction<ConnectionState>>()(
    persist(
      (set) => ({
        status: 'LOADING',
        description: '',
        updateStatus: (status) => set(() => ({ status })),
        updateDescription: (description) => set(() => ({ description })),
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
export const useDomainStore = createConnectionStore('domain');
