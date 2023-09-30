
import { App } from "@/shared/App";
import { Module, ActionContext } from "vuex";
import { AppInfo } from "@/shared/AppInfo";

interface State { }

export interface AppData {
    apps: App[];
    apiToken: object
    appInfo: AppInfo;
}

type AppConfigContext = ActionContext<AppData, State>

export const appData: Module<any, any> = {
    state: {
    } as AppData,

    mutations: {
    },

    actions: {
    }
}
