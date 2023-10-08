import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { APIHandler } from "./APIHandler";
import { GetAPIHandler } from "./GetAPIHandler";
import { PostAPIHandler } from "./PostAPIHandler";
import { PatchAPIHandler } from "./PatchAPIHandler";


const TAG = "AppStoreHandler";

export class AppStoreHandler implements IPCListener {

    private apiHandlers: APIHandler[] = [new GetAPIHandler(), new PostAPIHandler, new PatchAPIHandler()];

    notify(args: CommandValue): boolean {
        this.apiHandlers.forEach(apiHandler => {
            if (apiHandler.isValid(args)) {
                apiHandler.run(args);
            }
        });

        return false;
    }
}


