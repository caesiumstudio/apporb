import { Module } from "vuex"
import { ActionContext } from "vuex"

interface State { }

export interface AppConfig {
    darkMode: boolean,
    toggleSettingsDialog: boolean,
    toggleAboutDialog: boolean,
    isProgressOn: boolean,
    toggleOrbAiChatView: boolean
}

type AppConfigContext = ActionContext<AppConfig, State>

export const appConfig: Module<any, any> = {
    state: {
        darkMode: false,
        toggleSettingsDialog: false,
        toggleAboutDialog: false,
        isProgressOn: false,
        toggleOrbAiChatView: false
    } as AppConfig,

    mutations: {
        setProgressState: (state: AppConfig, isProgressOn: boolean) => {
            state.isProgressOn = isProgressOn;
        },

        toggleSettingsDialog: (state: AppConfig) => {
            state.toggleSettingsDialog = !state.toggleSettingsDialog
        },

        toggleOrbAiChatViewDialog: (state: AppConfig) => {
            state.toggleOrbAiChatView = !state.toggleOrbAiChatView
        },

        toggleAboutDialog: (state: AppConfig) => {
            state.toggleAboutDialog = !state.toggleAboutDialog
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

        toggleAboutDialog: (context: AppConfigContext) => {
            context.commit("toggleAboutDialog");
        },

        toggleSettingsDialog: (context: AppConfigContext) => {
            context.commit("toggleSettingsDialog");
        },

        toggleOrbAiChatViewDialog: (context: AppConfigContext) => {
            context.commit("toggleOrbAiChatViewDialog");
        }
    },
}
