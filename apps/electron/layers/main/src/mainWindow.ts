import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from 'url';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    width: 475,
    height: 550,
    movable: false, // The window should not be movable
    resizable: false, // The window should not be resizable
    show: false, // Create the window as hidden
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true, // The window will not show up in the taskbar
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  // Prevent the window from being destroyed; hide it instead
  browserWindow.on('close', (event) => {
    event.preventDefault();
    browserWindow.hide();
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012

  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });
     */

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : format({
          pathname: join(app.getAppPath(), '..', 'web', 'out', 'index.html'),
          protocol: 'file:',
          slashes: true,
        });

  await browserWindow.loadURL(pageUrl);

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
