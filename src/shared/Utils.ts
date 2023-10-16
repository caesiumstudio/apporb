import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { FileSystem } from './FSystem';


export class Utils {
    static isRelease() {
        return process.env.NODE_ENV === 'production';
    }

    static joinPath(pathA: string, pathB: string): string {
        return path.join(pathA, pathB);
    }

    static openLinkExternal(link: string) {
        console.log('opening link');
        // shell.opeipcReceivenExternal(link);
    }

    static getUID(): string {
        return uuidv4();
    }

    static isWindows() {
        return process.platform === 'win32';
    }

    static getPlatform() {
        return process.platform;
    }

    static cloneObject(jsonObject: object) {
        return JSON.parse(JSON.stringify(jsonObject));
    }

    static getTimestamp() {
        const currentDate = new Date();
        return currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear()
            + " @ " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    }

    static isEmpty(obj: object): boolean {
        return Object.keys(obj).length <= 0;
    }
}
