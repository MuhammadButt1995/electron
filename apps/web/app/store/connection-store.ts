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

export const useInternetStore = create<
  ConnectionState & ConnectionAction<ConnectionState>
>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      updateStatus: (status) => set(() => ({ status })),
      updateDescription: (description) => set(() => ({ description })),
    }),
    {
      name: 'internet-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useADStore = create<
  ConnectionState & ConnectionAction<ConnectionState>
>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      updateStatus: (status) => set(() => ({ status })),
      updateDescription: (description) => set(() => ({ description })),
    }),
    {
      name: 'ad-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useDomainStore = create<
  ConnectionState & ConnectionAction<ConnectionState>
>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      updateStatus: (status) => set(() => ({ status })),
      updateDescription: (description) => set(() => ({ description })),
    }),
    {
      name: 'domain-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const internetStore = useInternetStore.getState();
export const ADStore = useADStore.getState();
export const domainStore = useDomainStore.getState();
