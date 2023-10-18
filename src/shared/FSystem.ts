
import path from 'path';
import fs from 'fs';
import { Log } from './Logger';

export class FileSystem {

    getDirPath(filePath: string): string {
        return path.dirname(filePath);
    }

    isDir(filePath: string): boolean {
        const fsObject: fs.Stats = fs.lstatSync(filePath);
        return fsObject.isDirectory();
    }

    isExist(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    isValidBookFormat(filePath: string): boolean {
        return !!filePath.match(/.*\.(pdf|epub|mobi|djvu|cbz|cbr|docx)$/ig);
    }

    makeDirIfNotExist(dirPath: string): void {
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    }

    getUniqueName(fullPath: string, index = 0): string {
        let checkName = fullPath, ext = '';
        if (index) {
            if (checkName.indexOf('.') > -1) {
                const tokens = checkName.split('.'); ext = '.' + tokens.pop();
                checkName = tokens.join('.');
            }

            checkName = `${checkName}-${index}${ext}`;
            Log.debug("TAG", "New name: " + checkName);
        }

        const nameExists = this.isExist(checkName);
        Log.debug("TAG", "Already exists: " + checkName);
        return nameExists ? this.getUniqueName(fullPath, index + 1) : checkName;
    }
}