import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Credentials } from "./Credentials";
import { Commands } from "@/shared/constants/Commands";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { DBClient } from "../db/DBClient";

const TAG = "ClientCredentials";
export class ClientCredentials implements IPCListener {

    notify(args: CommandValue): boolean {
        if (args.command === Commands.CMD_LOAD_APP_CONNECT_API_CREDENTIALS) {
            const dbClient = new DBClient();
            args.value = dbClient.getCredentials();
            IPCNative.instance().onNativeEvent(args);
        } else if (args.command === Commands.CMD_SAVE_APP_CONNECT_API_CREDENTIALS) {
            const dbClient = new DBClient();
            args.value = dbClient.saveCredentials(args.value);

            Log.debug(TAG, "Saving credentials: " + args.value);
            args.value = "Settings saved";
            IPCNative.instance().onNativeEvent(args);
        }
        return false;
    }

    public getCredentials(): Credentials {
        return new Credentials();
    }


}