import { createStore } from 'zustand/vanilla';

export type TrayIconState = 'green' | 'yellow';

type TrayState = {
  icon: TrayIconState;
};

type TrayActions = {
  updateIcon: (icon: TrayIconState) => void;
};

export const trayStore = createStore<TrayState & TrayActions>((set) => ({
  icon: 'green',
  updateIcon: (icon) => set(() => ({ icon })),
}));

export const updateTrayStore = (newIcon: TrayIconState) => {
  trayStore.getState().updateIcon(newIcon);
};
