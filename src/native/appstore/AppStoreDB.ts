import { app } from 'electron';
import Datastore from 'nedb';
import { Log } from '@/shared/Logger';
import { Notification } from '@/shared/Notification';
import { Utils } from '@/shared/Utils';

const TAG = "AppStoreDB";

export class AppStoreDB {
    public static appStoreDB: AppStoreDB;
    private dataStore: Datastore;

    static instance(): AppStoreDB {
        if (!this.appStoreDB) {
            this.appStoreDB = new AppStoreDB();
            Log.debug(TAG, "AppStoreDB Initialized");
        }

        return this.appStoreDB;
    }

    constructor() {
        let dbPath = Utils.joinPath(app.getPath("userData"), "appStore.db");
        Log.debug(TAG, dbPath);

        this.dataStore = new Datastore({
            filename: dbPath,
            autoload: true,
            onload: function (error: any) { Log.debug(TAG, error) }
        });
    }

    saveCredentials(credentials: AppStoreCredentials) {
        Log.debug(TAG, 'credentials saved: ' + JSON.stringify(credentials));
        this.dataStore.update({
            name: credentials.name
        }, credentials, { upsert: true },
            (err: any, numReplaced: number, upsert: any) => {
                Log.debug(TAG, 'Upserted credentials: ' + numReplaced);
            });
    }

    getCredentials(name: string): Promise<AppStoreCredentials> {
        return new Promise<AppStoreCredentials>((resolve, reject) => {
            this.dataStore.find({ name: name }, (err: any, docs: any) => {
                if (docs.length) {
                    Log.debug(TAG, "Found " + docs.length + " notifications");
                    resolve(docs[0]);
                } else {
                    Log.debug(TAG, "No credentials found");
                    reject([]);
                }
            });
        });
    }
}