interface Window {
    readonly app: { version: number; };
    readonly onInternetStateChanged: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer;
    readonly onADStateChanged: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer;
    readonly onDomainStateChanged: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer;
}
