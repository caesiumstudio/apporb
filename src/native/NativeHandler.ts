import { app, BrowserWindow } from "electron"
import { IPCNative } from "./ipc/IpcNative"
import { Commands } from "../shared/constants/Commands";

export class NativeHandler {
  private wind: BrowserWindow
  private ipcNative: IPCNative;

  constructor(wind: BrowserWindow) {
    this.wind = wind;
    this.ipcNative = IPCNative.instance();
    this.ipcNative.setWindow(wind);


    app.commandLine.appendSwitch("disable-http-cache");


    this.ipcNative.onNativeEvent({ command: Commands.CMD_READY });
  }
}
