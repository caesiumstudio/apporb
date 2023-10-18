import { BrowserWindow, ipcMain } from "electron"
import { CommandValue, IPCListener } from "../../shared/IPCListener"
import { Log } from "../../shared/Logger"
import { AppStoreHandler as AppStoreHandler } from "../appstore/AppStoreHandler"
import { ClientCredentials } from "../appstore/ClientCredentials"
import { NotificationHandler as NotificationHandler } from "../notification/NotificationHandler"
import { ScreenshotHandler } from "../screenshots/ScreenshotHandler"

const TAG = "IPCNative";
export class IPCNative {
    private static singleton: IPCNative;

    private ipcListeners: IPCListener[];
    private browserWindow?: BrowserWindow;

    public static instance(): IPCNative {
        if (!IPCNative.singleton) {
            IPCNative.singleton = new IPCNative();
        }

        return IPCNative.singleton;
    }

    constructor() {
        // register modules
        this.ipcListeners = [new AppStoreHandler(), new ClientCredentials(), new NotificationHandler(), new ScreenshotHandler()];
        this.init();
    }

    setWindow(browserWindow: BrowserWindow): void {
        this.browserWindow = browserWindow
    }

    addObserver(ipcListener: IPCListener) {
        this.ipcListeners.push(ipcListener);
    }

    onNativeEvent(args: CommandValue): void {
        if (this.browserWindow) {
            Log.debug("NATIVE_TO_RENDERER", args.command);
            this.browserWindow.webContents.send("NATIVE_TO_RENDERER", args);
        }
    }

    init() {
        ipcMain.on(
            "RENDERER_TO_NATIVE",
            (event, args: { command: string; value: any }) => {
                Log.debug(TAG + " RENDERER_TO_NATIVE", args.command);
                this.ipcListeners.forEach((ipcListener: IPCListener) => {
                    ipcListener.notify(args);
                });
            }
        );
    }
}
