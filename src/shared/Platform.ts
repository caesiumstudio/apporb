export class Platform {
    public static isWindowsOS() {
        return process.platform == 'win32';
    }

    public static isMacOS() {
        return process.platform == 'darwin';
    }

    public static isLinux() {
        return process.platform !== 'win32' && process.platform !== 'darwin';
    }
}