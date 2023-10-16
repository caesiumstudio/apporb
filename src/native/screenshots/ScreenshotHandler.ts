import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Commands } from "@/shared/constants/Commands";
import { APIHandler } from "../appstore/APIHandler";
import { ImageEditor } from "./ImageEditor";
import { ScreenshotDBHandler } from "./ScreenshotDBHandler";

const TAG = "ScreenshotHandler";

export class ScreenshotHandler implements IPCListener {

    private apiHandlers: APIHandler[] = [new ImageEditor(), new ScreenshotDBHandler()];

    notify(args: CommandValue): boolean {

        this.apiHandlers.forEach(apiHandler => {
            if (apiHandler.isValid(args)) {
                apiHandler.run(args);
            }
        });

        return false;
    }
}


