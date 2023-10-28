<template>
  <div id="sidebar" class="ui large vertical menu inverted">
    <div class="item">
      <div class="menu app-header" @click="onLoadApps">
        <a class="item active"><i class="sync icon"></i>Load Apps</a>
      </div>
      <!-- <div class="header app-header" @click="onLoadApps"> Apps <i class="sync icon"></i></div> -->

      <div class="menu">
        <div class="ui divider"></div>
        <div v-for="app in apps" :key="app.id" @click="removeApp">
          <a
            :class="[
              'item',
              selectedAppId == getAttributes(app).bundleId
                ? 'active app-selected'
                : '',
            ]"
            @click="onAppSelected(app)"
          >
            {{ getAttributes(app).name }}
          </a>
          <div class="ui divider"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Log } from "@/shared/Logger";
import { App } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ViewController } from "@/renderer/ViewController";
const TAG = "AppSidebar";
export default {
  components: {},
  data() {
    return {
      apps: [],
      selectedAppId: "",
    };
  },

  methods: {
    getAttributes(app) {
      return App.getAttributes(app) || {};
    },

    onLoadApps() {
      ViewController.setProgress(true);

      IPCClient.instance().request(
        { command: Commands.CMD_HTTP_GET_LOAD_APPS, value: "/v1/apps" },
        (response) => {
          ViewController.setProgress(false);
          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 3000);
          } else {
            this.apps = this.getAppList(response.data);
          }
        }
      );
    },

    getAppList(respData) {
      const appData = respData["data"];
      Log.debug(TAG, JSON.stringify(appData[0].attributes));

      let apps = [];
      appData.forEach((appJson) => {
        Log.debug("Response: ", appJson);
        apps.push(appJson);
      });

      return apps;
    },

    onAppSelected(app) {
      this.selectedAppId = this.getAttributes(app).bundleId;
      this.$emit("onAppSelected", app);
    },
  },
};
</script>

<style scoped>
#sidebar {
  width: 240px;
  height: 100%;
  border-radius: 0;
}
.app-selected {
  font-weight: 700;
}
.app-header {
  margin: 0;
  font-size: 1.2em;
}
</style>
