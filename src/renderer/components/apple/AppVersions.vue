<template>
  <div class="">
    <div v-if="Object.keys(app).length">
      <div v-show="appVersions.length > 0" class="ui styled fluid accordion">
        <template v-for="appVersion in appVersions" :key="appVersion.id">
          <div class="title">
            <i class="dropdown icon"></i>
            {{ getAttributes(appVersion).versionString }}
            {{ getAttributes(appVersion).appStoreState }}
          </div>
          <div class="content">
            <AppVersionLocalization
              :appVersion="appVersion"
            ></AppVersionLocalization>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { App, APPLE_DEV_HOST } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";
import AppVersionLocalization from "@/renderer/components/apple/AppVersionLocalization";
import { ViewController } from "@/renderer/ViewController";
import { Toaster } from "@/renderer/services/Toaster";

export default {
  components: { AppVersionLocalization },

  data() {
    return {
      appVersions: [],
      selectedBookTitle: "",
      loaderConfig: {
        isIconVisible: false,
        text: "Load and select an app",
      },
    };
  },

  props: {
    app: Object,
  },

  watch: {
    app: {
      handler(newApp) {
        this.loadAppVersions(newApp);
      },
    },
  },

  methods: {
    loadAppVersions(app) {
      ViewController.setProgress(true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_GET_APP_STORE_VERSIONS,
          value: this.getPath(app.relationships.appStoreVersions.links.related),
        },
        (response) => {
          ViewController.setProgress(false);

          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 3000);
          } else {
            this.appVersions = response.data.data;
          }
        }
      );
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(app) {
      return App.getAttributes(app) || {};
    },
  },

  mounted() {
    window.$(".ui.accordion").accordion();
    window.$(".menu .item").tab();
  },

  computed: {
    darkMode() {
      return this.$store.state.appConfig.darkMode;
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  padding: 8px 8px 128px 8px;
}

#content {
  border: none;
}
</style>