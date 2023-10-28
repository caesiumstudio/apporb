import { app, BrowserWindow } from "electron"
import { IPCNative } from "./ipc/IpcNative"
import { Commands } from "@/shared/constants/Commands";
import { ClientCredentials } from "./appstore/ClientCredentials";

export class NativeHandler {
  private win: BrowserWindow
  private ipcNative: IPCNative;

  constructor(win: BrowserWindow) {
    this.win = win;
    this.ipcNative = IPCNative.instance();
    this.ipcNative.setWindow(win);


    app.commandLine.appendSwitch("disable-http-cache");


    this.ipcNative.onNativeEvent({ command: Commands.CMD_READY });
  }
}
