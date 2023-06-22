import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WiFiState = {
  status: 'LOADING' | 'RELIABLE' | 'DECENT' | 'SLOW' | 'ERROR';
  description?: string;
  data: {
    signal: number;
    link: string;
    channel: number;
  };
};

export type WiFiAction<T extends WiFiState> = {
  updateStatus: (status: T['status']) => void;
  updateDescription: (description: T['description']) => void;
  updateData: (data: Partial<T['data']>) => void;
};

export const useWiFiStore = create<WiFiState & WiFiAction<WiFiState>>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      data: {
        signal: 0,
        link: '',
        channel: 0,
      },
      updateStatus: (status) => set({ status }),
      updateDescription: (description) => set({ description }),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
    }),
    {
      name: 'wifi-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
