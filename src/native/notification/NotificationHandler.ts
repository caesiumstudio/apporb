import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Log } from "@/shared/Logger";
import { HttpHandler } from "@/native/appstore/HttpHandler";
import { Notification, emptyNotification } from "@/shared/Notification";
import { NotificationDB } from "./NotificationDB";
import { IPCNative } from "../ipc/IpcNative";
import { StatusResponse } from "@/shared/StatusResponse";
import { FCMNotif } from "./FcmNotif";

const TAG = "NotificationHandler";

export class NotificationHandler implements IPCListener {
    private fcmNotif = new FCMNotif();
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
        const postData = args.value.postData;

        // if (!postData.token && postData.topic) {
        //     const status: StatusResponse = { code: 0, message: "Missing token or topic" };
        //     args.value = status;
        //     IPCNative.instance().onNativeEvent(args);
        // }

        if (!postData.serviceAccountJsonPath) {
            const status: StatusResponse = { code: 0, message: "Missing service account json path" };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        }

        Log.debug(TAG, "NotifData: " + JSON.stringify(args.value));

        this.fcmNotif.initApp(postData.serviceAccountJsonPath);

        if (postData.topic) {
            this.fcmNotif.sendToTopic(postData.topic, postData.notification, postData.data).then((res: any) => {
                Log.debug(TAG, res);
                args.value = { code: 0, message: "Notification sent", data: res };
                IPCNative.instance().onNativeEvent(args);
            }).catch((error: any) => {
                Log.error(TAG, error);
                const status: StatusResponse = { code: -1, message: "Error sending notification", data: error };
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            });
        }

        if (postData.token) {
            this.fcmNotif.sendToToken(postData.token, postData.notification, postData.data).then((res: any) => {
                Log.debug(TAG, res);
                args.value = { code: 0, message: "Notification sent", data: res };
                IPCNative.instance().onNativeEvent(args);
            }).catch((error: any) => {
                Log.error(TAG, error);
                const status: StatusResponse = { code: -1, message: "Error sending notification", data: error };
                args.value = status;
                IPCNative.instance().onNativeEvent(args);
            });
        }
    }
}



