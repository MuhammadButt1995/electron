/* eslint-disable consistent-return */
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import restoreOrCreateWindow from '@main/mainWindow';
import prepareRenderer from 'electron-next';
import path from 'path';

import { createTray } from './tray';

if (process.platform !== 'darwin') {
  app.setAppUserModelId(process.execPath);
}

if (process.platform === 'darwin' && !import.meta.env.DEV) {
  app.dock.hide();
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

const PATH_TO_NEXT_APP = path.join(
  __dirname,
  import.meta.env.DEV ? '../../../../web' : '../../../web'
);
const PORT = 3000;
let mainWindow: BrowserWindow;

function navigateToFile(filePath: string) {
  if (mainWindow) {
    const pageUrl = `file://${path.resolve(
      `${process.resourcesPath}/app/web/out${filePath}.html`
    )}`;
    mainWindow.loadURL(pageUrl);
  }
}

app.on('ready', async () => {
  await prepareRenderer(PATH_TO_NEXT_APP, PORT);
  mainWindow = await restoreOrCreateWindow();
  const tray = createTray(mainWindow);
});

ipcMain.on('navigate', (event, route) => {
  if (route === '/') {
    navigateToFile('/index');
  } else {
    navigateToFile(route);
  }
});

ipcMain.on('check-daas', (event) => {
  const envKeys = Object.keys(process.env);
  const isOnDaas = envKeys.some((key) => key.includes('ViewClient'));
  // eslint-disable-next-line no-param-reassign
  event.returnValue = isOnDaas;
});

ipcMain.on('window-open-link', (_event, args) => {
  shell.openExternal(args);
});
