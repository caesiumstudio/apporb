import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { Notification, emptyNotification } from "@/shared/Notification";
import { NotificationDB } from "./NotificationDB";
import { IPCNative } from "../ipc/IpcNative";
import { StatusResponse } from "@/shared/StatusResponse";

const TAG = "NotificationHandler";

export class NotificationHandler implements IPCListener {

    notify(args: CommandValue): boolean {
        if (args.command === "CMD_HTTP_POST_NOTIFICATION") {
            this.post(args);
        } else if (args.command === "CMD_SAVE_NOTIFICATION") {
            this.saveNotification(args);
        } else if (args.command === "CMD_GET_ALL_NOTIFICATIONS") {
            this.getAllNotifications(args)
        }

        return false;
    }

    private getAllNotifications(args: CommandValue) {
        const notifDB = NotificationDB.instance();
        notifDB.getAllNotifications().then((notification: Notification[]) => {
            args.value = notification;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            args.value = [emptyNotification];
            IPCNative.instance().onNativeEvent(args);
        });
    }

    private saveNotification(args: CommandValue) {
        const notifDB = NotificationDB.instance();
        notifDB.notifUpsert(args.value);


        const status: StatusResponse = { code: 0, message: "Notification test saved" };
        args.value = status;
        IPCNative.instance().onNativeEvent(args);

    }

    private post(args: CommandValue) {
        const httpHandler = new HttpHandler();
        const options = this.getPostOptions(args.value);
        if (options.headers.Authorization.length < 30) {
            const status: StatusResponse = { code: 0, message: "Invalid auth key" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        } else if (args.value.postData.to.length < 3) {
            const status: StatusResponse = { code: 0, message: "Invalid topic" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }

        httpHandler.makePostRequest(options, JSON.stringify(args.value.postData)).then((jsonResponse: string) => {
            Log.debug(TAG, jsonResponse);

            const status: StatusResponse = { code: 0, message: "Sent successfully", data: JSON.parse(jsonResponse) };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }).catch(error => {
            Log.error(TAG, error);
            const status: StatusResponse = { code: -1, message: "Error sending notification", data: error };
            args.value = status;
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


