import {
    Database
} from "./Database";
import { Log } from "@/shared/Logger";
const TAG = "DBClient";
export class DBClient {

    public getCredentials(): any {
        const db: Database = new Database();
        try {
            db.read();
            console.log(db.jsonDBContent["settings"]);
            return db.jsonDBContent["settings"]["credentials"];
        } catch (e) {
            Log.error(TAG, e as string);
        }

    }

    public saveCredentials(credentials: object) {
        const db: Database = new Database();
        db.jsonDBContent = { settings: { credentials: credentials } };
        db.write();
    }
}