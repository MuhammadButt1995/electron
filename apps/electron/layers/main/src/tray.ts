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

import calculateTrayWindowPosition from '@utils/trayUtils';

let tray: Tray | null = null;
let trayMenu: Electron.Menu | null = null; // Keep a reference to the menu
const isMacOS = process.platform === 'darwin';

export const createTray = (mainWindow: BrowserWindow) => {
  let trayIcon = nativeImage.createFromPath(
    path.join(__dirname, '../../../buildResources/robot-x.png')
  );

  trayIcon = trayIcon.resize({ width: 20 });

  tray = new Tray(trayIcon);

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
      id: 'wifi',
      label: `Wi-Fi Signal`,
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

export type ConnectionStatus =
  | 'LOADING'
  | 'CONNECTED'
  | 'NOT CONNECTED'
  | 'ERROR';

export type WiFiStatus = 'LOADING' | 'RELIABLE' | 'DECENT' | 'SLOW' | 'ERROR';

type IconPaths = {
  loading: string;
  check: string;
  warning: string;
  x_mark: string;
};

export const updateTrayIcon = () => {
  if (!tray || !trayMenu) return;

  const statusItemIds = ['internet', 'AD', 'domain']; // Add the ids of your status items here

  const allConnected = trayMenu.items
    .filter((item) => statusItemIds.includes(item.id)) // Only consider status items
    .every(
      (item) => item.sublabel === 'Connected' || item.sublabel === 'Reliable'
    );

  const iconPath = allConnected
    ? path.join(__dirname, '../../../buildResources/robot-check.png')
    : path.join(__dirname, '../../../buildResources/robot-x.png');

  let trayIcon = nativeImage.createFromPath(iconPath);
  trayIcon = trayIcon.resize({ width: 20 });

  tray.setImage(trayIcon);
};

export const updateTrayMenu = (
  data: ConnectionStatus | WiFiStatus,
  menuItemId: string,
  icons: IconPaths
) => {
  if (!tray || !trayMenu) return;

  // Create a new array of menu items with the updated item
  const updatedMenuItems = trayMenu.items.map((item) => {
    if (item.id !== menuItemId) return item;

    let iconPath: string;
    let sublabel: string;

    switch (data) {
      case 'LOADING':
        iconPath = icons.loading;
        sublabel = 'Loading...';
        break;
      case 'CONNECTED':
        iconPath = icons.check;
        sublabel = 'Connected';
        break;
      case 'NOT CONNECTED':
        iconPath = icons.warning;
        sublabel = 'Not Connected';
        break;
      case 'RELIABLE':
        iconPath = icons.check;
        sublabel = 'Reliable';
        break;
      case 'DECENT':
        iconPath = icons.warning;
        sublabel = 'Decent';
        break;
      case 'SLOW':
        iconPath = icons.x_mark;
        sublabel = 'Slow';
        break;
      case 'ERROR':
        iconPath = icons.x_mark;
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
