import { app, BrowserWindow } from 'electron';
import { join, resolve } from 'path';
import { format } from 'url';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    width: 560,
    height: 560,
    movable: false, // The window should not be movable
    resizable: false, // The window should not be resizable
    show: false, // Create the window as hidden
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true, // The window will not show up in the taskbar
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      webSecurity: false,
    },
  });

  // Prevent the window from being destroyed; hide it instead
  browserWindow.on('close', (event) => {
    event.preventDefault();
    browserWindow.hide();
  });

  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : `file://${resolve(`${process.resourcesPath}/app/web/out/index.html`)}`;

  await browserWindow.loadURL(pageUrl);

  if (!import.meta.env.DEV) {
    browserWindow.webContents.openDevTools();
  }

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
const restoreOrCreateWindow = async () => {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();

  return window;
};

export default restoreOrCreateWindow;
