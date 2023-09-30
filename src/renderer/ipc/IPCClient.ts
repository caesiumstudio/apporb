import { CommandValue, IPCListener } from "@/shared/IPCListener";
import { IPCRenderer } from "./IPCRenderer";
import { Utils } from "@/shared/Utils";
import { Log } from "@/shared/Logger";

const TAG = "IPCClient";

export default class IPCClient implements IPCListener {
    private static singleton: IPCClient;
    private map: any;

    public static instance() {
        if (!IPCClient.singleton) {
            IPCClient.singleton = new IPCClient();
            IPCRenderer.instance().addObserver(IPCClient.singleton);
            IPCClient.singleton.map = {};
        }
        return IPCClient.singleton;
    }

    public request(args: CommandValue, callback: any) {
        if (!args.id) args.id = Utils.getUID();

        this.map[args.id] = callback;

        IPCRenderer.instance().msgToNative(args);
    }

    notify(args: CommandValue): boolean {
        if (args.id && this.map[args.id]) {
            this.map[args.id](args.value);
            return true;
        } else {
            Log.error(TAG, "Http request callback not found");
        }
        return false;
    }


}