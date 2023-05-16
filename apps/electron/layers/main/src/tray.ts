import {
  app,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
} from 'electron';
import path from 'path';
import { debounce } from 'lodash';

import {
  internetStore,
  azureStore,
  domainStore,
  getInternetState,
  getAzureState,
  getDomainState,
} from './store';

let tray: Tray | null = null;

const menuItems: (MenuItemConstructorOptions & { id?: string })[] = [
  {
    id: 'internet',
    label: `Internet Connection`,
    icon: getInternetState().icon,
    sublabel: getInternetState().sublabel,
  },
  { type: 'separator' },
  {
    id: 'azure',
    label: `Azure Connection`,
    icon: getAzureState().icon,
    sublabel: getAzureState().sublabel,
  },
  { type: 'separator' },
  {
    id: 'domain',
    label: `Domain Connection`,
    icon: getDomainState().icon,
    sublabel: getDomainState().sublabel,
  },
];

const createTray = () => {
  tray = new Tray(
    process.platform === 'win32'
      ? path.join(__dirname, '../../../buildResources/robot-base-gray.ico')
      : path.join(__dirname, '../../../buildResources/robot-base-gray.icns')
  );

  const buildMenuItems = (): (MenuItemConstructorOptions & {
    id?: string;
  })[] => [
    {
      id: 'internet',
      label: `Internet Connection`,
      icon: getInternetState().icon,
      sublabel: getInternetState().sublabel,
    },
    { type: 'separator' },
    {
      id: 'azure',
      label: `Azure Connection`,
      icon: getAzureState().icon,
      sublabel: getAzureState().sublabel,
    },
    { type: 'separator' },
    {
      id: 'domain',
      label: `Domain Connection`,
      icon: getDomainState().icon,
      sublabel: getDomainState().sublabel,
    },
  ];

  const updateMenu = debounce(() => {
    if (tray) {
      console.log('Updating tray menu...');
      const menu = Menu.buildFromTemplate(buildMenuItems());
      tray.setContextMenu(menu);
    }
  }, 300); // Adjust debounce time as needed

  updateMenu(); // Initial menu creation

  const unsubscribers = [
    internetStore.subscribe(() => {
      updateMenu();
    }),
    azureStore.subscribe(() => {
      updateMenu();
    }),
    domainStore.subscribe(() => {
      updateMenu();
    }),
  ];

  app.on('before-quit', () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    if (tray !== null) {
      tray.destroy();
      tray = null;
    }
  });

  return tray;
};

export default createTray;
