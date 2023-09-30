import { Log } from "../../shared/Logger";
const https = require("https");

const TAG = "HttpHandler";
export class HttpHandler {
    public makeGetRequest(options: object): Promise<any> {
        return new Promise((resolve, reject) => {
            let jsonResponseStr = "";
            let req = https.request(options, (res: any) => {

                res.setEncoding("UTF8");

                res.on("data", (chunk: any) => {
                    jsonResponseStr += chunk;
                });

                res.on('end', () => {
                    resolve(jsonResponseStr);
                });
            });

            req.on("error", function (e: any) {
                Log.error(TAG, e.message);
                reject(e);
            });

            req.end();
        });
    }


    public makePostRequest(options: object, data: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let jsonResponseStr = "";
            let req = https.request(options, (res: any) => {

                res.setEncoding("UTF8");

                res.on("data", function (chunk: any) {
                    jsonResponseStr += chunk;
                });

                res.on('end', () => {
                    resolve(jsonResponseStr);
                });
            });

            req.on("error", (e: any) => {
                console.log("Error: " + e.message);
                reject(e);
            });

            req.write(data);
            req.end();
        });
    }

}