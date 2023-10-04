import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { HttpHandler } from "@/native/AppleAppStore/HttpHandler";
import { APPLE_DEV_HOST } from "@/shared/App";
const jwt = require("jsonwebtoken");

const TAG = "FirebaseApiClient";

export class FirebaseApiClient implements IPCListener {

    notify(args: CommandValue): boolean {
        if (args.command.startsWith("CMD_HTTP_POST_NOTIFICATION")) {
            this.post(args);
        }

        return false;
    }

    private post(args: CommandValue) {
        // Log.debug(TAG, "Posting: " + JSON.stringify(args));

        const httpHandler = new HttpHandler();
        const options = this.getPostOptions(args.value);
        Log.debug(TAG, JSON.stringify(options));
        Log.debug(TAG, JSON.stringify(args.value.postData));
        httpHandler.makePostRequest(options, JSON.stringify(args.value.postData)).then((jsonResponse: string) => {
            Log.debug(TAG, jsonResponse);
            args.value = jsonResponse;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            Log.error(TAG, error);
            args.value = error;
            Log.error(TAG, JSON.stringify(args));
            IPCNative.instance().onNativeEvent(args);
        });
    }


    public getPostOptions(value: any) {
        return {
            host: "fcm.googleapis.com",
            path: "/fcm/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json; UTF-8",
                Authorization: value.authKey
            },
        };
    }
}


