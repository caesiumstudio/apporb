import { Log } from "@/shared/Logger";
import { IPCListener } from "@/shared/IPCListener";
import { Store } from "vuex";
import { IPCRenderer } from "./ipc/IPCRenderer";
import { AppState } from "@/shared/AppState";
import { Commands } from "@/shared/constants/Commands";

export class ViewController implements IPCListener {
    private static inst: ViewController;
    private vuexStore: Store<AppState>;
    private ipcRenderer: IPCRenderer;

    public static instance(): ViewController {
        return ViewController.inst;
    }

    public getVuexStore(): Store<AppState> {
        return this.vuexStore;
    }

    constructor(vuexStore: Store<AppState>) {
        this.vuexStore = vuexStore;

        this.ipcRenderer = IPCRenderer.instance();
        this.ipcRenderer.addObserver(this);
        this.ipcRenderer.msgToNative({ command: Commands.CMD_READY, value: {} });

        ViewController.inst = this;
    }

    onReady() {
        this.ipcRenderer.msgToNative({ command: Commands.CMD_READY, value: {} });
    }

    notify(args: { command: string; value: any }): boolean {
        switch (args.command) {
            case Commands.CMD_FIRST_RUN:
                return true;
            case Commands.CMD_DARK_MODE:
                this.ipcRenderer.msgToNative({ command: Commands.CMD_DARK_MODE, value: null });
                break;
            default:
                Log.error(
                    "ViewController",
                    "Unknown event received from IPCNative"
                )
        }

        return false
    }
}
