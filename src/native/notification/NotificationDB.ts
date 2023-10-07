import { app } from 'electron';
import Datastore from 'nedb';
import { Log } from '@/shared/Logger';
import { Notification } from '@/shared/Notification';
import { Utils } from '@/shared/Utils';

const TAG = "NotificationDB";

export class NotificationDB {
    public static notifDB: NotificationDB;
    private dataStore: Datastore;

    static instance(): NotificationDB {
        if (!this.notifDB) {
            this.notifDB = new NotificationDB();
            Log.debug(TAG, "NotifDB Initialized");
        }

        return this.notifDB;
    }

    constructor() {
        let dbPath = Utils.joinPath(app.getPath("userData"), "notifDB.db");
        Log.debug(TAG, dbPath);

        this.dataStore = new Datastore({
            filename: dbPath,
            autoload: true,
            onload: (error: any) => { Log.debug(TAG, error) }
        });
    }

    notifUpsert(notif: Notification) {
        Log.debug(TAG, 'notif saved: ' + JSON.stringify(notif));

        this.dataStore.update({
            id: notif.id
        }, notif, { upsert: true },
            (err: any, numReplaced: number, upsert: any) => {
                Log.debug(TAG, 'error: ' + err + ' Upserted book: ' + numReplaced + " upsert: " + upsert);
            });
    }

    getAllNotifications(): Promise<Notification[]> {
        return new Promise<Notification[]>((resolve, reject) => {
            this.dataStore.find({}, (err: any, docs: any) => {
                if (docs.length) {
                    Log.debug(TAG, "Found " + docs.length + " notifications");
                    resolve(docs);
                } else {
                    Log.debug(TAG, "No notifications found");
                    reject([]);
                }
            });
        });
    }
}