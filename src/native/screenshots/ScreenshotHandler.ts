import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Commands } from "@/shared/constants/Commands";
import { APIHandler } from "../appstore/APIHandler";
import { ImageEditor } from "./ImageEditor";

const TAG = "ScreenshotHandler";

export class ScreenshotHandler implements IPCListener {

    private apiHandlers: APIHandler[] = [new ImageEditor()];

    notify(args: CommandValue): boolean {
        if (args.command == Commands.CMD_SAVE_SCREENSHOT) {
            this.apiHandlers.forEach(apiHandler => {
                if (apiHandler.isValid(args)) {
                    apiHandler.run(args);
                }
            });
        }

        return false;
    }
}


