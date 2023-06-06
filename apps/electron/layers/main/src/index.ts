import { BrowserWindow, app, ipcMain } from 'electron';
import restoreOrCreateWindow from '@main/mainWindow';
import prepareRenderer from 'electron-next';
import path from 'path';

import {
  updateInternetStore,
  updateADStore,
  updateDomainStore,
  checkAndUpdateIcon,
  notificationUnsubscribers,
  ConnectionMessage,
} from '@store/store';
import { trayStore } from '@store/tray-store';
import { getCrossPlatformIcon } from '@utils/iconUtils';
import { workerTs } from '@utils/workerUtils';
import createTray from './tray';

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

  const updateTrayUnsubscriber = trayStore.subscribe(() => {
    const { icon } = trayStore.getState();
    const iconName = icon === 'green' ? 'robot-green' : 'robot-yellow';
    const iconPath = getCrossPlatformIcon(
      path.join(__dirname, '../../../buildResources/', iconName)
    );
    tray?.setImage(iconPath);
  });

  const worker = workerTs(
    path.join(__dirname, '../src/lib/websocket/worker.ts'),
    {
      worderData: {
        /* */
      },
    }
  );

  worker.on('message', (data) => {
    const { tool, message } = data;
    switch (tool) {
      case 'InternetConnectionTool':
        updateInternetStore(message as ConnectionMessage);
        mainWindow.webContents.send(
          'internet-state-changed',
          message as ConnectionMessage
        );
        break;
      case 'ADConnectionTool':
        updateADStore(message as ConnectionMessage);
        mainWindow.webContents.send(
          'ad-state-changed',
          message as ConnectionMessage
        );
        break;
      case 'DomainConnectionTool':
        updateDomainStore(message as ConnectionMessage);
        mainWindow.webContents.send(
          'domain-state-changed',
          message as ConnectionMessage
        );
        break;
      default:
        console.error(`Unknown tool: ${tool}`);
    }
    checkAndUpdateIcon();
  });

  // Error Handler
  worker.on('error', (error) => {
    console.error(`Worker thread encountered an error: ${error}`);
  });

  // Exit Handler
  worker.on('exit', (code) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });

  // Request latest states from tools
  worker.postMessage({ requestLatest: 'InternetConnectionTool' });
  worker.postMessage({ requestLatest: 'ADConnectionTool' });
  worker.postMessage({ requestLatest: 'DomainConnectionTool' });

  app.on('before-quit', () => {
    updateTrayUnsubscriber();
    notificationUnsubscribers.forEach((unsubscribe) => unsubscribe());
  });
});
