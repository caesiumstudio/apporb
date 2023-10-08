import { CommandValue } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { ClientCredentials } from "./ClientCredentials";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
import { APIHandler } from "./APIHandler";
import { StatusResponse } from "@/shared/StatusResponse";
const jwt = require("jsonwebtoken");

const TAG = "PatchAPIHandler";

export class PatchAPIHandler implements APIHandler {
    isValid(args: CommandValue): boolean {
        const commandList: string[] = ["CMD_HTTP_PATCH_APP_STORE_VERSION_UPDATE"];
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        this.patch(args);
    }


    private async patch(args: CommandValue) {
        const httpHandler = new HttpHandler();
        const options = await this.getPatchOptions(args.value.url);

        httpHandler.makePostRequest(options, JSON.stringify(args.value.patchData)).then((jsonResponse: string) => {
            const status: StatusResponse = { code: 0, message: "Operation successful.", data: JSON.parse(jsonResponse) };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            Log.error(TAG, error);
            const status: StatusResponse = { code: -1, message: "Version update failed" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        });
    }


    private async getPatchOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = await clientCredentials.getCredentials();

        const token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

        return {
            host: APPLE_DEV_HOST,
            path: path,
            method: "PATCH",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        };
    }
}


