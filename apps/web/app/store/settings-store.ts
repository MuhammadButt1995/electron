/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface SettingsState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
