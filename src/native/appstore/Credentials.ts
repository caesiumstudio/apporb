import { DBClient } from "../db/DBClient";
import fs from 'fs';

export class Credentials {

    public get privateKey() {
        const dbClient = new DBClient();
        const credentials: any = dbClient.getCredentials();
        return fs.readFileSync(credentials["authTokenFilePath"]);
    }

    public get apiKeyId(): string {
        const dbClient = new DBClient();
        const credentials: any = dbClient.getCredentials();
        return credentials["keyID"];
    }

    public get issuerId() {
        const dbClient = new DBClient();
        const credentials: any = dbClient.getCredentials();
        return credentials["issuerID"];
    }

    public get payload() {
        let now = Math.round(new Date().getTime() / 1000);
        let nowPlus20 = now + 1199;

        return {
            iss: this.issuerId,
            exp: nowPlus20,
            aud: "appstoreconnect-v1",
        };
    }

    public get signOptions() {
        return {
            algorithm: "ES256",
            header: {
                alg: "ES256",
                kid: this.apiKeyId,
                typ: "JWT",
            },
        };
    }
}