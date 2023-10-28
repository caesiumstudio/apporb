import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { Commands } from "@/shared/constants/Commands";
import { APIHandler } from "../appstore/APIHandler";
import { ImageLoader } from "./ImageLoader";
import { IconBuilderDBHandler } from "./IconBuilderDBHandler";

const TAG = "IconBuilder";

export class IconBuilder implements IPCListener {

    private apiHandlers: APIHandler[] = [new ImageLoader(), new IconBuilderDBHandler()];

    notify(args: CommandValue): boolean {

        this.apiHandlers.forEach(apiHandler => {
            if (apiHandler.isValid(args)) {
                apiHandler.run(args);
            }
        });

        return false;
    }
}


