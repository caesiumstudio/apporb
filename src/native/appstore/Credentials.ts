import fs from 'fs';

export class Credentials {
    private credentials: any;

    constructor(credentials: object) {
        this.credentials = credentials;
    }

    public get privateKey() {
        return fs.readFileSync(this.credentials["authTokenFilePath"]);
    }

    public get apiKeyId(): string {
        return this.credentials["keyID"];
    }

    public get issuerId() {
        return this.credentials["issuerID"];
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