// import { shell } from 'electron';
// import { Md5 } from '@/native/services/Md5';
import { v4 as uuidv4 } from 'uuid';
import path from "path";

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

    static formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static getThumbPath(thumbPath: string) {
        // if it is a placeholder from assets folder
        // OR it is an online image for advert
        if (thumbPath.search("placeholder") >= 0 || thumbPath.search("https://") >= 0) {
            return thumbPath;
        }

        return 'file://' + thumbPath;
    }
}
