import { Store, createStore } from "vuex";
import { appConfig } from "./appConfigModule";
import { appData } from "./appDataModule";
import { AppState } from "@/shared/AppState";

const store: Store<AppState> = createStore<AppState>({
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    appConfig,
    appData,
  },
});

export default store;
