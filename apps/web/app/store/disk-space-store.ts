import { create } from 'zustand';
import dayjs from 'dayjs';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DiskSpaceState = {
  status: 'LOADING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ERROR';
  description?: string;
  diskData: {
    totalDiskSpace: string;
    currentDiskUsage: string;
    remainingDiskSpace: string;
  };
  lastUpdated: string;
};

export type DiskSpaceAction<T extends DiskSpaceState> = {
  updateStatus: (status: T['status']) => void;
  updateDescription: (description: T['description']) => void;
  updateDiskData: (data: Partial<T['diskData']>) => void;
  updateLastUpdated: (lastUpdated: T['lastUpdated']) => void;
};

export const useDiskSpaceStore = create<
  DiskSpaceState & DiskSpaceAction<DiskSpaceState>
>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      lastUpdated: dayjs().format('ddd, MMM D, YYYY h:mm A'),
      diskData: {
        totalDiskSpace: '',
        currentDiskUsage: '',
        remainingDiskSpace: '',
      },
      updateStatus: (status) => set({ status }),
      updateDescription: (description) => set({ description }),
      updateDiskData: (data) =>
        set((state) => ({ diskData: { ...state.diskData, ...data } })),
      updateLastUpdated: (lastUpdated) => set(() => ({ lastUpdated })),
    }),
    {
      name: 'disk-space-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
