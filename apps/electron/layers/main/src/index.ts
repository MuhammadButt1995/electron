import { app, nativeImage, Tray } from 'electron';
import restoreOrCreateWindow from '@main/mainWindow';
import prepareRenderer from 'electron-next';
import path from 'path';
import { Worker } from 'worker_threads';
import {
  updateInternetStore,
  updateAzureStore,
  updateDomainStore,
  getInternetState,
  getAzureState,
  getDomainState,
  trayStore,
  checkAndUpdateIcon,
} from './store';
import createTray from './tray';
import NotificationHandler from './NotificationHandler';

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
app.on('second-instance', restoreOrCreateWindow);

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
app.on('activate', restoreOrCreateWindow);

/**
 * Uses prepareRenderer to launch next dev server on port 3000 (same as vite server)
 * PrepareRenderer is used to configure next to work with electron
 * Create app window when background process will be ready
 */

const PATH_TO_NEXT_APP = path.join(__dirname, '../../../../web');
const PORT = 3000;
const notificationHandler = new NotificationHandler();

app.on('ready', async () => {
  await prepareRenderer(PATH_TO_NEXT_APP, PORT);
  const tray = createTray();

  const unsubscribe = trayStore.subscribe(() => {
    const { icon } = trayStore.getState();
    const iconName = icon === 'green' ? 'robot-green.ico' : 'robot-yellow.ico';
    const iconPath = path.join(__dirname, '../../../buildResources/', iconName);
    tray?.setImage(iconPath);
  });

  const workerPath = path.join(__dirname, '../src/worker.js');
  const worker = new Worker(workerPath);

  worker.on('message', (data) => {
    const { tool, message } = data;
    switch (tool) {
      case 'InternetConnectionTool':
        updateInternetStore(message);
        break;
      case 'AzureConnectionTool':
        updateAzureStore(message);
        break;
      case 'DomainConnectionTool':
        updateDomainStore(message);
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
  worker.postMessage({ requestLatest: 'AzureConnectionTool' });
  worker.postMessage({ requestLatest: 'DomainConnectionTool' });

  app.on('before-quit', unsubscribe);
});

// Subscribe to store changes
getInternetState().subscribe((set, get, api) => {
  if (get().wasConnectedNowNotConnected()) {
    notificationHandler.addNotification({
      title: 'Internet Connection Lost',
      body: 'Your internet connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/wifi-off.ico')
      ), // Replace this path with the path to your icon
    });
  }
});

getDomainState().subscribe((set, get, api) => {
  if (get().wasConnectedNowNotConnected()) {
    notificationHandler.addNotification({
      title: 'Domain Connection Lost',
      body: 'Your domain connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/domain-off.ico')
      ), // Replace this path with the path to your icon
    });
  }
});

getAzureState().subscribe((set, get, api) => {
  if (get().wasConnectedNowNotConnected()) {
    notificationHandler.addNotification({
      title: 'Azure Connection Lost',
      body: 'Your Azure connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/cloud.ico')
      ), // Replace this path with the path to your icon
    });
  }
});

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}
