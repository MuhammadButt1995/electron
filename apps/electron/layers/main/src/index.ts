import { BrowserWindow, app, ipcMain } from 'electron';
import restoreOrCreateWindow from '@main/mainWindow';
import prepareRenderer from 'electron-next';
import path from 'path';

import { createTray, updateTrayMenu } from './tray';

const iconPaths = {
  loading: path.join(__dirname, '../assets/loading.png'),
  connected: path.join(__dirname, '../assets/check.png'),
  notConnected: path.join(__dirname, '../assets/warning.png'),
  error: path.join(__dirname, '../assets/cross.png'),
};

const createStatusChangeHandler =
  (menuItemId: string) => (event: any, data: any) => {
    console.log(data);
    updateTrayMenu(data, menuItemId, iconPaths);
  };

if (process.platform !== 'darwin') {
  app.setAppUserModelId(process.execPath);
}

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
// app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
// app.on('activate', restoreOrCreateWindow);

/**
 * Uses prepareRenderer to launch next dev server on port 3000 (same as vite server)
 * PrepareRenderer is used to configure next to work with electron
 * Create app window when background process will be ready
 */

const PATH_TO_NEXT_APP = path.join(__dirname, '../../../../web');
const PORT = 3000;
let mainWindow: BrowserWindow;

app.on('ready', async () => {
  await prepareRenderer(PATH_TO_NEXT_APP, PORT);
  mainWindow = await restoreOrCreateWindow();
  const tray = createTray(mainWindow);

  ipcMain.on('onInternetStatusChange', createStatusChangeHandler('internet'));
  ipcMain.on('onADStatusChange', createStatusChangeHandler('AD'));
  ipcMain.on('onDomainStatusChange', createStatusChangeHandler('domain'));
});
