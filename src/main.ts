import { createApp } from "vue";
import App from "./renderer/App.vue";
import router from "./renderer/router";
import store from "./renderer/store";
import { ViewController } from "./renderer/ViewController";

new ViewController(store);

createApp(App).use(store).use(router).mount("#app");
