import { BrowserWindow, ipcMain } from "electron"
import { CommandValue, IPCListener } from "../../shared/IPCListener"
import { Log } from "../../shared/Logger"
import { APIClient } from "../AppleAppStore/APIClient"
import { ClientCredentials } from "../AppleAppStore/ClientCredentials"
import { FirebaseApiClient } from "../notification/FirebaseApiClient"

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
        this.ipcListeners = [new APIClient(), new ClientCredentials(), new FirebaseApiClient()];
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
                Log.debug(TAG + " RENDERER_TO_NATIVE", JSON.stringify(args));
                this.ipcListeners.forEach((ipcListener: IPCListener) => {
                    ipcListener.notify(args);
                });
            }
        );
    }
}
