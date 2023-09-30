import { v4 as uuidv4 } from "uuid";
import path from "path";
export class Utils {
  static isRelease() {
    return process.env.NODE_ENV === "production";
  }

  static joinPath(pathA: string, pathB: string): string {
    return path.join(pathA, pathB);
  }

  static getUID(): string {
    return uuidv4();
  }

  static isWindows() {
    return process.platform === "win32";
  }

  static getPlatform() {
    return process.platform;
  }

}
