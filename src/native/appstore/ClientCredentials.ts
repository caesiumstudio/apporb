import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Commands } from "@/shared/constants/Commands";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { AppStoreDB } from "./AppStoreDB";
import { StatusResponse } from "@/shared/StatusResponse";
import { Credentials } from "./Credentials";

const CREDENTIALS_NAME = "AppStoreCredentials";
const TAG = "ClientCredentials";

export class ClientCredentials implements IPCListener {

    private appStoreDB = AppStoreDB.instance();

    notify(args: CommandValue): boolean {
        if (args.command === Commands.CMD_LOAD_APP_CONNECT_API_CREDENTIALS) {
            this.appStoreDB.getCredentials(CREDENTIALS_NAME).then(credentials => {
                const status: StatusResponse = { code: 0, message: "Credentials Loaded", data: credentials.data };
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            }).catch(e => {
                Log.error(TAG, "Could not load credentials " + e);

                const status: StatusResponse = { code: -1, message: "No credentials found"};
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            });

        } else if (args.command === Commands.CMD_SAVE_APP_CONNECT_API_CREDENTIALS) {
            const appStoreCredentials: AppStoreCredentials = { name: CREDENTIALS_NAME, data: args.value };
            args.value = this.appStoreDB.saveCredentials(appStoreCredentials);
            Log.debug(TAG, "Saving credentials: " + args.value);

            const status: StatusResponse = { code: 0, message: "Credentials Saved" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }
        return false;
    }


    public async getCredentials() {
        const appStoreDB = AppStoreDB.instance();
        const credentials = await appStoreDB.getCredentials(CREDENTIALS_NAME);
        return new Credentials(credentials.data);
    }


}