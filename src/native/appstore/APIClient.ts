import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { ClientCredentials } from "./ClientCredentials";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
const jwt = require("jsonwebtoken");

const TAG = "AppsLoader";

export class APIClient implements IPCListener {

    notify(args: CommandValue): boolean {
        const map: any = {
            "CMD_HTTP_GET_LOAD_APPS": this.get,
            "CMD_HTTP_GET_APP_STORE_VERSIONS": this.get,
            "CMD_HTTP_GET_APP_STORE_VERSION_LOCALIZATIONS": this.get,

            "CMD_HTTP_PATCH_APP_STORE_VERSION_UPDATE": this.patch,
            "CMD_HTTP_POST_APP_STORE_VERSION_CREATE": this.post,

        };
        const method = map[args.command];
        if (method) {
            method.call(this, args);
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


