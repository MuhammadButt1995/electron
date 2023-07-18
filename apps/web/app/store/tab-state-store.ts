import { create } from 'zustand';

type Store = {
  networkStatus: boolean;
  identityServicesStatus: boolean;
  deviceStatus: boolean;
  internetStatus: boolean;
  enterpriseStatus: boolean;
  setNetworkStatus: (status: boolean) => void;
  setIdentityServicesStatus: (status: boolean) => void;
  setDeviceStatus: (status: boolean) => void;
  setInternetStatus: (status: boolean) => void;
  setEnterpriseStatus: (status: boolean) => void;
};

export const useTabStateStore = create<Store>((set) => ({
  networkStatus: false,
  identityServicesStatus: false,
  deviceStatus: false,
  internetStatus: false,
  enterpriseStatus: false,
  setNetworkStatus: (status) => set({ networkStatus: status }),
  setIdentityServicesStatus: (status) =>
    set({ identityServicesStatus: status }),
  setDeviceStatus: (status) => set({ deviceStatus: status }),
  setInternetStatus: (status) => set({ internetStatus: status }),
  setEnterpriseStatus: (status) => set({ enterpriseStatus: status }),
}));
