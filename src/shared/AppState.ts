import { AppConfig } from "vue";
import { AppData } from "./constants/AppData";

export interface AppState {
  appConfig: AppConfig;
  appData: AppData;
}
