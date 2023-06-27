import { create } from 'zustand';
import dayjs from 'dayjs';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LDAPPasswordState = {
  passwordExpiresIn: 'LOADING' | string;
  description?: string;
  lastUpdated: string;
};

export type LDAPPasswordAction<T extends LDAPPasswordState> = {
  updatePasswordExpiresIn: (expiresInString: T['passwordExpiresIn']) => void;
  updateDescription: (description: T['description']) => void;
  updateLastUpdated: (lastUpdated: T['lastUpdated']) => void;
};

export const useLDAPPasswordStore = create<
  LDAPPasswordState & LDAPPasswordAction<LDAPPasswordState>
>()(
  persist(
    (set) => ({
      passwordExpiresIn: 'LOADING',
      description: '',
      lastUpdated: dayjs().format('ddd, MMM D, YYYY h:mm A'),
      updatePasswordExpiresIn: (passwordExpiresIn) =>
        set({ passwordExpiresIn }),
      updateDescription: (description) => set({ description }),
      updateLastUpdated: (lastUpdated) => set(() => ({ lastUpdated })),
    }),
    {
      name: 'ldap-password-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
