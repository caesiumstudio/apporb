export const APPLE_DEV_HOST = "api.appstoreconnect.apple.com";

export class App {
    private jsonObject: object;

    constructor(json: object) {
        this.jsonObject = json;
    }


    // Util functions for processing app json data
    public static getAttributes(jsonObject: any): object {
        return jsonObject.attributes;
    }
}