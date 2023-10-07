import { CommandValue } from "@/shared/IPCListener";

export interface APIHandler {
    isValid(args: CommandValue): boolean;
    run(args: CommandValue): void;
}