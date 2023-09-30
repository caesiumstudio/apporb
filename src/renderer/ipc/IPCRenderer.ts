import { Log } from "@/shared/Logger";
import { CommandValue, IPCListener } from "@/shared/IPCListener"
declare const electron: any;

export class IPCRenderer {
    private static ipcRendererInstance: IPCRenderer
    private ipcListeners: IPCListener[];

    public static instance(): IPCRenderer {
        if (!IPCRenderer.ipcRendererInstance) {
            IPCRenderer.ipcRendererInstance = new IPCRenderer()
        }

        return IPCRenderer.ipcRendererInstance
    }

    constructor() {
        this.ipcListeners = [];
        this.init()
    }

    addObserver(ipcListener: IPCListener) {
        this.ipcListeners.push(ipcListener)
    }

    msgToNative(args: CommandValue) {
        electron.ipcSend("RENDERER_TO_NATIVE", args);
    }

    init() {
        electron.ipcReceive(
            "NATIVE_TO_RENDERER",
            (event: any, args: { command: string; value: any }) => {
                // Log.debug("Received from native: ", args.command + ', ' + args.value);
                for (let i = 0; i < this.ipcListeners.length; i++) {
                    this.ipcListeners[i].notify(args)
                }
            }
        )
    }
}
