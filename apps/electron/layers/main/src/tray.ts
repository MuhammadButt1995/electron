/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable default-case */

import { Tray, nativeImage, BrowserWindow, screen } from 'electron';
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
    path.join(__dirname, '../../../buildResources/robot.png')
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
};
