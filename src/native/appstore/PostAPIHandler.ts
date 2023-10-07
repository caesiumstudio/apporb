import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { ClientCredentials } from "./ClientCredentials";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
import { StatusResponse } from "@/shared/StatusResponse";
const jwt = require("jsonwebtoken");

const TAG = "AppsLoader";

export class PostAPIHandler {
    isValid(args: CommandValue): boolean {
        const commandList: string[] = ["CMD_HTTP_POST_APP_STORE_VERSION_CREATE"]
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        this.post(args);
    }

    private async post(args: CommandValue) {
        Log.debug(TAG, "Posting: " + JSON.stringify(args));

        const httpHandler = new HttpHandler();
        const options = await this.getPostOptions(args.value.url);

        httpHandler.makePostRequest(options, JSON.stringify(args.value.postData)).then((jsonResponse: string) => {
            args.value = jsonResponse;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            const status: StatusResponse = { code: -1, message: "Operation failed." };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        });
    }

    private async getPostOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = await clientCredentials.getCredentials();
        const token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

        return {
            host: APPLE_DEV_HOST,
            path: path,
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        };
    }
}


