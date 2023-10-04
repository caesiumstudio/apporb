import { app } from 'electron';
import Datastore from 'nedb';
import { Log } from '@/shared/Logger';
import { Notification } from '@/shared/Notification';
import { Utils } from '@/shared/Utils';

const TAG = "NotificationDB";

export class NotifDB {
    public static notifDB: NotifDB;
    private dataStore: Datastore;

    static instance(): NotifDB {
        if (!this.notifDB) {
            this.notifDB = new NotifDB();
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
            onload: function (error: any) { Log.debug(TAG, error) }
        });
    }

    notifUpsert(notif: Notification) {
        Log.debug(TAG, 'notif saved: ' + JSON.stringify(notif));
        this.dataStore.update({
            fingerprint: notif.id
        }, notif, { upsert: true },
            (err: any, numReplaced: number, upsert: any) => {
                Log.debug(TAG, 'Upserted book: ' + numReplaced);
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

    // bookGetByFingerprint(fingerprint: string) {
    //     return new Promise((resolve, reject) => {
    //         this.bookDB.find({ fingerprint: fingerprint }, (err: any, docs: any) => {
    //             if (docs.length) {
    //                 Log.debug(TAG, "Found " + docs.length + " docs");
    //                 resolve(docs);
    //             } else {
    //                 Log.debug(TAG, "No book found by fingerprint: " + fingerprint);
    //                 reject(null);
    //             }
    //         });
    //     });
    // }

    // bookRemoveAll(): Promise<number> {
    //     return new Promise<number>((resolve, reject) => {
    //         this.bookDB.remove({}, {
    //             multi: true
    //         }, (err, numRemoved) => {
    //             resolve(numRemoved);
    //         });
    //     });
    // }

    // removeBook(book: Book): Promise<number> {
    //     Log.debug(TAG, "Removing: " + book.title + ": " + book.fingerprint);
    //     return new Promise<number>((resolve, reject) => {
    //         this.bookDB.remove({
    //             fingerprint: book.fingerprint
    //         }, {
    //             multi: true
    //         }, (err, numRemoved) => {
    //             Log.debug(TAG, 'Removed ' + numRemoved + ' books');
    //             resolve(numRemoved);
    //         });
    //     });
    // }

    // bookUpdateCurPage(book: Book) {
    //     this.bookDB.findOne({ fingerprint: book.fingerprint }, (err: any, doc: any) => {
    //         doc.curPage = book.curPage;
    //         this.bookUpsert(doc);
    //     });
    // }

    // bookUpdateCollection(book: Book) {
    //     this.bookDB.findOne({ fingerprint: book.fingerprint }, (err: any, doc: any) => {
    //         doc.collection = book.collection;
    //         this.bookUpsert(doc);
    //     });
    // }

    // saveAudioBook(audioBook: AudioBook): void {
    //     Log.debug(TAG, 'bookUpsert: ' + JSON.stringify(audioBook));
    //     this.bookDB.update({
    //         fingerprint: audioBook.fingerprint
    //     }, audioBook, { upsert: true },
    //         (err, numReplaced, upsert) => {
    //             Log.debug(TAG, 'upserted: ' + numReplaced);
    //         });
    // }

}