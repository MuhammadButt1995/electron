/**
 * @module preload
 */

import { contextBridge, ipcRenderer } from 'electron';

const isDev = import.meta.env.DEV;

contextBridge.exposeInMainWorld('navigate', (route: string) => {
  ipcRenderer.send('navigate', route);
});

contextBridge.exposeInMainWorld('meta', {
  isDev,
  openLink: (link: string) => ipcRenderer.send('window-open-link'),
  isOnDaas: () => ipcRenderer.sendSync('check-daas'),
});

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */
