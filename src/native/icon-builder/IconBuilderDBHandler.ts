import { CommandValue } from "@/shared/IPCListener";
import { IPCNative } from "../ipc/IpcNative";
import { StatusResponse } from "@/shared/StatusResponse";
import { ScreenshotConfig } from "@/shared/ScreenshotConfig";
import { IconBuilderDB } from "./IconBuilderDB";
import { Commands } from "@/shared/constants/Commands";
import { Log } from "@/shared/Logger";
import { IconConfig } from "./IconConfig";

const ImageDataURI = require('image-data-uri');

const TAG = "IconBuilderDBHandler";

export class IconBuilderDBHandler {
    private screenshotDB = IconBuilderDB.instance();

    isValid(args: CommandValue): boolean {
        const commandList: string[] = [
            "CMD_SAVE_SCREENSHOT",
            "CMD_GET_ALL_SCREENSHOT_CONFIG"
        ];
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        // if (args.command == Commands.CMD_SAVE_SCREENSHOT) {
        //     this.screenshotDB.configUpsert(ScreenshotConfig.fromJSON(args.value));
        //     Log.debug(TAG, "Saved screenshot config");

        //     const status: StatusResponse = { code: 0, message: "Config saved" };
        //     args.value = status;
        //     IPCNative.instance().onNativeEvent(args);
        // }


        // if (args.command == Commands.CMD_GET_ALL_SCREENSHOT_CONFIG) {
        //     this.screenshotDB.getAllScreenshotConfig().then((iconConfigs: IconConfig[]) => {
        //         args.value = iconConfigs;
        //         IPCNative.instance().onNativeEvent(args);
        //     }).catch((error: any) => {
        //         args.value = [];
        //         IPCNative.instance().onNativeEvent(args);
        //     });
        // }
    }
}


