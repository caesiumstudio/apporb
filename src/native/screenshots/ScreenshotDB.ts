import { app } from 'electron';
import Datastore from 'nedb';
import { Log } from '@/shared/Logger';
import { Notification } from '@/shared/Notification';
import { Utils } from '@/shared/Utils';
import { ScreenshotConfig } from '@/shared/ScreenshotConfig';

const TAG = "ScreenshotDB";

export class ScreenshotDB {
    public static screenshotDB: ScreenshotDB;
    private dataStore: Datastore;

    static instance(): ScreenshotDB {
        if (!this.screenshotDB) {
            this.screenshotDB = new ScreenshotDB();
            Log.debug(TAG, "Database Initialized");
        }

        return this.screenshotDB;
    }

    constructor() {
        let dbPath = Utils.joinPath(app.getPath("userData"), "screenshotDB.db");
        Log.debug(TAG, dbPath);

        this.dataStore = new Datastore({
            filename: dbPath,
            autoload: true,
            onload: (error: any) => { Log.debug(TAG, error) }
        });
    }

    configUpsert(config: ScreenshotConfig) {
        Log.debug(TAG, 'config saved: ' + JSON.stringify(config));

        this.dataStore.update({
            id: config.getId()
        }, config, { upsert: true },
            (err: any, numReplaced: number, upsert: any) => {
                Log.debug(TAG, 'error: ' + err + ' Upserted config: ' + numReplaced + " upsert: " + upsert);
            });
    }

    getAllScreenshotConfig(): Promise<ScreenshotConfig[]> {
        return new Promise<ScreenshotConfig[]>((resolve, reject) => {
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