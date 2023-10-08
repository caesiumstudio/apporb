import { CommandValue } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { ClientCredentials } from "./ClientCredentials";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
import { StatusResponse } from "@/shared/StatusResponse";
const jwt = require("jsonwebtoken");

const TAG = "AppsLoader";

export class GetAPIHandler {
    isValid(args: CommandValue): boolean {
        const commandList: string[] = [
            "CMD_HTTP_GET_LOAD_APPS",
            "CMD_HTTP_GET_APP_STORE_VERSIONS",
            "CMD_HTTP_GET_APP_STORE_VERSION_LOCALIZATIONS",
            "CMD_HTTP_GET_ALL_APP_STORE_REVIEWS",
            "CMD_HTTP_GET_APP_REVIEW_RESPONSE"
        ];
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        this.get((args));
    }

    private async get(args: CommandValue) {
        const httpHandler = new HttpHandler();
        try {
            const options = await this.getGetOptions(args.value);

            httpHandler.makeGetRequest(options).then((jsonResponse: string) => {
                const status: StatusResponse = { code: 0, message: "Operation successful.", data: JSON.parse(jsonResponse) };
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            }).catch(error => {
                const status: StatusResponse = { code: -1, message: "Operation failed." };
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            });
        } catch (e: any) {
            Log.error(TAG, "Missing credentials");
            const status: StatusResponse = { code: -1, message: "Missing credentials" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }
    }

    private async getGetOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = await clientCredentials.getCredentials();
        const token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

        return {
            host: APPLE_DEV_HOST,
            path: path,
            method: "GET",
            headers: {
                Accept: "application/a-gzip, application/json",
                Authorization: "Bearer " + token,
            },
        };
    }

}


