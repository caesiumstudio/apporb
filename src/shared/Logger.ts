import { Utils } from "./Utils"


export class Log {
    public static debug(tag: string, msg: string): void {
        if (!Utils.isRelease() && !process.env.IS_TEST) {
            console.log(
                "\u001b[" +
                    90 +
                    "m" +
                    "DEBUG - " +
                    tag +
                    ": " +
                    msg +
                    "\u001b[0m"
            )
        }
    }

    public static info(tag: string, msg: string): void {
        if (!Utils.isRelease() && !process.env.IS_TEST) {
            console.log(
                "\u001b[" +
                    93 +
                    "m" +
                    "INFO - " +
                    tag +
                    ": " +
                    msg +
                    "\u001b[0m"
            )
        }
    }

    public static error(tag: string, msg: string): void {
        console.log(
            "\u001b[" + 31 + "m" + "ERROR - " + tag + ": " + msg + "\u001b[0m"
        )
    }
}
