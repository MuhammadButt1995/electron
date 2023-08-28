/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable default-case */

import {
  Tray,
  Menu,
  nativeImage,
  MenuItemConstructorOptions,
  BrowserWindow,
  screen,
} from 'electron';
import path from 'path';
import positioner from 'electron-traywindow-positioner';

type AlignX = 'left' | 'center' | 'right';

// y align if tray bar is left or right (default: down)
type AlignY = 'up' | 'center' | 'down';

type Alignment = {
  x: AlignX;
  y: AlignY;
};

let tray: Tray | null = null;
let trayMenu: Electron.Menu | null = null;
const isMacOS = process.platform === 'darwin';

const customPosition = (mainWindow: BrowserWindow) => {
  if (isMacOS) {
    if (tray) {
      const trayBounds = tray.getBounds();
      const alignment: Alignment = { x: 'center', y: 'down' };
      trayBounds.y += 5; // Add a few pixels below the top menu bar
      positioner.position(mainWindow, trayBounds, alignment);
    }
  } else {
    const { workArea } = screen.getPrimaryDisplay();
    const windowBounds = mainWindow.getBounds();
    const x = workArea.x + workArea.width - windowBounds.width - 10; // 10 pixels padding from the right
    const y = workArea.y + workArea.height - windowBounds.height - 10; // 10 pixels padding from the bottom
    mainWindow.setPosition(x, y);
  }
};

export const createTray = (mainWindow: BrowserWindow) => {
  let trayIcon = nativeImage.createFromPath(
    path.join(__dirname, '../../../buildResources/robot-x.png')
  );

  trayIcon = trayIcon.resize({ width: 20 });

  tray = new Tray(trayIcon);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      customPosition(mainWindow);
      mainWindow.show();
    }
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
    { type: 'separator' },
    {
      id: 'ldap-password',
      label: `Password Expires In`,
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      ),
      sublabel: '',
    },
    { type: 'separator' },
    {
      id: 'disk-space',
      label: `Disk Space Usage`,
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

export type DiskSpaceStatus = 'LOADING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ERROR';

type IconPaths = {
  loading: string;
  check: string;
  warning: string;
  x_mark: string;
};

export const updateTrayIcon = () => {
  if (!tray || !trayMenu) return;

  const statusItemIds = ['internet', 'AD', 'domain', 'ldap-password']; // Add the ids of your status items here

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
  data: any,
  menuItemId: string,
  icons: IconPaths
) => {
  if (!tray || !trayMenu) return;

  // Create a new array of menu items with the updated item
  const updatedMenuItems = trayMenu.items.map((item) => {
    if (item.id !== menuItemId) return item;

    let iconPath: string;
    let sublabel: string;

    console.log(data);

    const parsedData = parseInt(data.split(' ')[0], 10);

    type StatusMapType = {
      [key: string]: { icon: string; label: string };
    };

    const statusMap: StatusMapType = {
      LOADING: { icon: icons.loading, label: 'Loading...' },
      CONNECTED: { icon: icons.check, label: 'Connected' },
      'NOT CONNECTED': { icon: icons.warning, label: 'Not Connected' },
      RELIABLE: { icon: icons.check, label: 'Reliable' },
      DECENT: { icon: icons.warning, label: 'Decent' },
      SLOW: { icon: icons.x_mark, label: 'Slow' },
      LOW: { icon: icons.check, label: 'Low' },
      MEDIUM: { icon: icons.warning, label: 'Medium' },
      HIGH: { icon: icons.x_mark, label: 'High' },
      ERROR: { icon: icons.x_mark, label: 'Error' },
    };

    if (Object.prototype.hasOwnProperty.call(statusMap, data)) {
      iconPath = statusMap[data].icon;
      sublabel = statusMap[data].label;
    } else if (parsedData >= 7) {
      iconPath = icons.check;
      sublabel = data;
    } else if (parsedData < 7 && parsedData >= 3) {
      iconPath = icons.warning;
      sublabel = data;
    } else if (parsedData < 3 || data.split(' ')[0] === 'Today') {
      iconPath = icons.x_mark;
      sublabel = data;
    } else {
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
