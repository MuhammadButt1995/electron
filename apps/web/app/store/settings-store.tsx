/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

type OS = 'macos' | 'windows' | undefined;
type InternetConnectionType = 'wifi' | 'ethernet' | undefined;
export type TrustedNetworkType = 'VPN' | 'ZPA' | undefined;

type GlobalState = {
  os: OS;
  isDaaSMachine: boolean;
  isConnectedToInternet: boolean | undefined;
  internetConnectionType: InternetConnectionType;
  isOnTrustedNetwork: boolean | undefined;
  trustedNetworkType: TrustedNetworkType;
};

type GlobalStateActions = {
  updateOS: (os: GlobalState['os']) => void;
  updateIsDaaSMachine: (isDaaSMachine: GlobalState['isDaaSMachine']) => void;
  updateIsConnectedToInternet: (
    isConnectedToInternet: GlobalState['isConnectedToInternet']
  ) => void;
  updateInternetConnectionType: (
    isConnectedToWiFi: GlobalState['internetConnectionType']
  ) => void;
  updateIsOnTrustedNetwork: (
    isOnTrustedNetwork: GlobalState['isOnTrustedNetwork']
  ) => void;
  updateTrustedNetworkType: (
    trustedNetworkType: GlobalState['trustedNetworkType']
  ) => void;
};

export const useGlobalStateStore = create<GlobalState & GlobalStateActions>(
  (set) => ({
    os: undefined,
    isConnectedToInternet: undefined,
    internetConnectionType: undefined,
    isOnTrustedNetwork: undefined,
    trustedNetworkType: undefined,
    isDaaSMachine: undefined,

    updateOS: (os) => set({ os }),
    updateIsDaaSMachine: (isDaaSMachine) => set({ isDaaSMachine }),
    updateIsConnectedToInternet: (isConnectedToInternet) =>
      set({ isConnectedToInternet }),
    updateInternetConnectionType: (internetConnectionType) =>
      set({ internetConnectionType }),
    updateIsOnTrustedNetwork: (isOnTrustedNetwork) =>
      set({ isOnTrustedNetwork }),
    updateTrustedNetworkType: (trustedNetworkType) =>
      set({ trustedNetworkType }),
  })
);
