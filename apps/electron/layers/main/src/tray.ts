/* eslint-disable import/prefer-default-export */
/* eslint-disable default-case */

import {
  Tray,
  Menu,
  nativeImage,
  MenuItemConstructorOptions,
  BrowserWindow,
} from 'electron';
import path from 'path';

import { getCrossPlatformIcon } from '@utils/iconUtils';
import calculateTrayWindowPosition from '@utils/trayUtils';

let tray: Tray | null = null;
let trayMenu: Electron.Menu | null = null; // Keep a reference to the menu
const isMacOS = process.platform === 'darwin';

export const createTray = (mainWindow: BrowserWindow) => {
  tray = new Tray(
    getCrossPlatformIcon(
      path.join(__dirname, '../../../buildResources/robot-yellow')
    )
  );

  const { roundedXPosition, roundedYPosition } = calculateTrayWindowPosition(
    tray,
    mainWindow
  );

  mainWindow.setPosition(roundedXPosition, roundedYPosition, false);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      return;
    }

    if (tray) mainWindow.show();
  });

  const buildMenuItems = (): (MenuItemConstructorOptions & {
    id?: string;
  })[] => [
    {
      id: 'internet',
      label: `Internet`,
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      ),
      sublabel: '',
    },
    { type: 'separator' },
    {
      id: 'AD',
      label: isMacOS ? 'On-Prem AD' : `Azure AD`,
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      ),
      sublabel: '',
    },
    { type: 'separator' },
    {
      id: 'domain',
      label: `Trusted Network`,
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      ),
      sublabel: '',
    },
  ];

  trayMenu = Menu.buildFromTemplate(buildMenuItems()); // Save the menu to trayMenu
  tray.setContextMenu(trayMenu);

  return tray;
};

export type ConnectionState = {
  status: 'LOADING' | 'CONNECTED' | 'NOT CONNECTED' | 'ERROR';
  description?: string;
};

type IconPaths = {
  loading: string;
  connected: string;
  notConnected: string;
  error: string;
};

export const updateTrayIcon = () => {
  if (!tray || !trayMenu) return;

  const allConnected = trayMenu.items.every(
    (item) => item.sublabel === 'Connected'
  );

  const iconPath = allConnected
    ? path.join(__dirname, '../../../buildResources/robot-green')
    : path.join(__dirname, '../../../buildResources/robot-yellow');

  tray.setImage(getCrossPlatformIcon(iconPath));
};

export const updateTrayMenu = (
  data: ConnectionState,
  menuItemId: string,
  icons: IconPaths
) => {
  if (!tray || !trayMenu) return;

  // Create a new array of menu items with the updated item
  const updatedMenuItems = trayMenu.items.map((item) => {
    if (item.id !== menuItemId) return item;

    let iconPath: string;
    let sublabel: string;

    switch (data.status) {
      case 'LOADING':
        iconPath = icons.loading;
        sublabel = 'Loading...';
        break;
      case 'CONNECTED':
        iconPath = icons.connected;
        sublabel = 'Connected';
        break;
      case 'NOT CONNECTED':
        iconPath = icons.notConnected;
        sublabel = 'Not Connected';
        break;
      case 'ERROR':
        iconPath = icons.error;
        sublabel = 'Error';
        break;
      default:
        return item;
    }

    return {
      ...item,
      icon: nativeImage.createFromPath(iconPath),
      sublabel,
    };
  });

  // Create a new menu with the updated items and set it as the context menu for the tray
  trayMenu = Menu.buildFromTemplate(updatedMenuItems);
  tray.setContextMenu(trayMenu);

  updateTrayIcon(); // Update the tray icon based on the status of all menu items
};
