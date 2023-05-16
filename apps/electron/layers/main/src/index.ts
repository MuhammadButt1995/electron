import { app, nativeImage } from 'electron';
import restoreOrCreateWindow from '@main/mainWindow';
import prepareRenderer from 'electron-next';
import path from 'path';
import { Worker } from 'worker_threads';
import {
  updateInternetStore,
  updateAzureStore,
  updateDomainStore,
  getInternetState,
} from './store';
import createTray from './tray';
import BalloonManager from './BalloonManager';

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

app.on('ready', async () => {
  await prepareRenderer(PATH_TO_NEXT_APP, PORT);
  const tray = createTray();

  tray.displayBalloon({
    icon: path.join(__dirname, '../../../buildResources/robot-base.ico'),
    title: 'Hello',
    content: 'Icon test.',
  });

  const balloonManager = new BalloonManager(tray); // Create BalloonManager instance

  // Register balloons here, e.g.
  balloonManager.registerBalloon({
    id: 'internetConnection',
    condition: (state) => state.connectionState === 'not_connected',
    options: {
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/wifi-lost.png')
      ),
      title: 'Internet Connection Lost',
      content: 'Your internet connection has been lost.',
    },
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

    balloonManager.checkAndDisplay(getInternetState());
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
