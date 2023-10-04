import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { IPCNative } from "../ipc/IpcNative";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { NotifDB } from "../db/NotifDB";
import { Notification } from "@/shared/Notification";

const TAG = "NotifHandler";

export class NotifHandler implements IPCListener {

    notify(args: CommandValue): boolean {
        if (args.command.startsWith("CMD_HTTP_POST_NOTIFICATION")) {
            this.post(args);
        } else if (args.command === "CMD_SAVE_NOTIFICATION") {
            this.saveNotification(args);
        } else if (args.command == "CMD_GET_ALL_NOTIFICATIONS") {
            this.getAllNotifications(args)
        }

        return false;
    }

    private getAllNotifications(args: CommandValue) {
        const notifDB = NotifDB.instance();
        notifDB.getAllNotifications().then((notifs: Notification[]) => {
            args.value = notifs;
            IPCNative.instance().onNativeEvent(args);
        });
    }

    private saveNotification(args: CommandValue) {
        const notifDB = NotifDB.instance();
        notifDB.notifUpsert(args.value);
        args.value = { message: "Saved" };
        IPCNative.instance().onNativeEvent(args);

    }

    private post(args: CommandValue) {
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


