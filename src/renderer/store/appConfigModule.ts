import { Module } from "vuex"
import { ActionContext } from "vuex"

interface State { }

export interface AppConfig {
    darkMode: boolean,
    toggleSettingsDialog: boolean,
    isProgressOn: boolean
}

type AppConfigContext = ActionContext<AppConfig, State>

export const appConfig: Module<any, any> = {
    state: {
        darkMode: false,
        toggleSettingsDialog: false,
        isProgressOn: false
    } as AppConfig,

    mutations: {
        setProgressState: (state: AppConfig, isProgressOn: boolean) => {
            state.isProgressOn = isProgressOn;
        },

        toggleSettingsDialog: (state: AppConfig) => {
            state.toggleSettingsDialog = !state.toggleSettingsDialog
        },

        toggleDarkMode: (state: AppConfig) => {
            state.darkMode = !state.darkMode;
        },
    },

    actions: {
        setProgressState: (context: AppConfigContext, isProgressOn: boolean) => {
            context.commit("setProgressState", isProgressOn);
        },
        toggleDarkMode: (context: AppConfigContext) => {
            context.commit("toggleDarkMode");
        },

        toggleSettingsDialog: (context: AppConfigContext) => {
            context.commit("toggleSettingsDialog");
        }
    },
}
