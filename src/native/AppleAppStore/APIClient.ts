import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { ClientCredentials } from "./ClientCredentials";
import { HttpHandler } from "@/native/AppleAppStore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
const jwt = require("jsonwebtoken");

const TAG = "AppsLoader";

export class APIClient implements IPCListener {

    notify(args: CommandValue): boolean {
        if (args.command.startsWith("CMD_HTTP_GET")) {
            this.get(args);
        } else if (args.command.startsWith("CMD_HTTP_PATCH")) {
            this.patch(args);
        } else if (args.command.startsWith("CMD_HTTP_POST")) {
            this.post(args);
        }

        return false;
    }

    private get(args: CommandValue) {
        const httpHandler = new HttpHandler();
        try {
            const options = this.getGetOptions(args.value);

            httpHandler.makeGetRequest(options).then((jsonResponse: string) => {
                args.value = jsonResponse;

                IPCNative.instance().onNativeEvent(args);
            }).catch(error => {
                Log.error(TAG, error);
            });
        } catch (e: any) {
            Log.error(TAG, "Missing credentials");
            args.value = { error: "Missing credentials" };
            IPCNative.instance().onNativeEvent(args);
        }

    }

    private patch(args: CommandValue) {
        Log.debug(TAG, "Patching: " + JSON.stringify(args));
        const httpHandler = new HttpHandler();
        const options = this.getPatchOptions(args.value.url);

        httpHandler.makePostRequest(options, JSON.stringify(args.value.patchData)).then((jsonResponse: string) => {
            args.value = jsonResponse;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            Log.error(TAG, error);
        });
    }

    private post(args: CommandValue) {
        Log.debug(TAG, "Posting: " + JSON.stringify(args));

        const httpHandler = new HttpHandler();
        const options = this.getPostOptions(args.value.url);

        httpHandler.makePostRequest(options, JSON.stringify(args.value.postData)).then((jsonResponse: string) => {
            args.value = jsonResponse;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            Log.error(TAG, error);
        });
    }

    public getGetOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = clientCredentials.getCredentials();

        let token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

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

    public getPatchOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = clientCredentials.getCredentials();

        let token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

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

    public getPostOptions(path: string) {
        const clientCredentials: ClientCredentials = new ClientCredentials();
        const credentials = clientCredentials.getCredentials();
        let token = jwt.sign(credentials.payload, credentials.privateKey, credentials.signOptions);

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


