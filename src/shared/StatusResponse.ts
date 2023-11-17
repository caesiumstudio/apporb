import { Log } from "./Logger";

const TAG = "ResponseParser";

export class ResponseParser {
    static parse(response: string): StatusResponse {
        const resp = JSON.parse(response);
        const errors = resp.errors;
        const status: StatusResponse = { code: 0, message: "Success!", data: resp };
        if (errors && errors.length) {
            status.code = -1;
            status.message = errors[0].title;
        }

        Log.debug(TAG, "Server Response: " + response);
        Log.debug(TAG, "Return Status: " + JSON.stringify(status));
        return status;
    }

    static getErrorResponse(message: string): StatusResponse {
        const status: StatusResponse = { code: -1, message: message, data: {} };
        return status;
    }
}

export interface StatusResponse {
    code: number,
    message: string,
    data?: object
}