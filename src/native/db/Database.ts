import { Utils } from '@/shared/Utils';
import { app } from 'electron';
import { Log } from '@/shared/Logger';
import fs from 'fs';

const TAG = "Database";
export class Database {
    public jsonDBContent: any = {};
    private path = Utils.joinPath(app.getPath("userData"), "database.db");

    write() {
        Log.debug(TAG, "Database Path " + this.path);
        if (this.jsonDBContent != null) {
            fs.writeFileSync(this.path, JSON.stringify(this.jsonDBContent));
        }
    }

    read() {
        Log.debug(TAG, "database file path " + this.path);
        if (this.path != null && fs.existsSync(this.path)) {
            const content: Buffer = fs.readFileSync(this.path);
            return this.jsonDBContent = JSON.parse(content.toString());
        }
        throw new Error("No data found");
    }

}