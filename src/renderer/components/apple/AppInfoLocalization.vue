<template>
  <div>
    <div class="ui">
      <div v-if="Object.keys(getAttributes(appInfo)).length" class="content">
        <div class="ui">
          <div class="ui form">
            <div class="field">
              <label>Title</label>
              <input type="text" v-model="getAttributes(appInfo).name" spellcheck="true" />
            </div>
            <div class="field">
              <label>Subtitle</label>
              <input type="text" v-model="getAttributes(appInfo).subtitle" spellcheck="true" />
            </div>
            <div class="field">
              <label>Privacy Policy Url</label>
              <input type="text" v-model="getAttributes(appInfo).privacyPolicyUrl" spellcheck="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Translation } from "@/shared/constants/Translation";
import { App, APPLE_DEV_HOST } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
export default {
  components: {

  },

  data() {
    return {
      appInfo: {},
      loaderConfig: {
        isIconVisible: true,
        text: "Loading apps data",
      },
    };
  },

  props: {
    appInfos: Object,
  },

  watch: {
    appInfos: {
      handler(newAppInfos) {
        console.log(JSON.stringify(newAppInfos));
        this.appInfo = newAppInfos;
      },
    },
  },

  methods: {
    saveTranslation(index) {
      ViewController.setProgress(true);

      // const appVersionLocalization = this.appVersionLocalizations[index];
      // let attributes = this.getAttributes(appVersionLocalization);
      // attributes = JSON.parse(JSON.stringify(attributes));
      // delete attributes.locale;

      // const patchData = {
      //   data: {
      //     type: "appStoreVersionLocalizations",
      //     id: appVersionLocalization.id,
      //     attributes: JSON.parse(JSON.stringify(attributes)),
      //   },
      // };

      // IPCClient.instance(this.appVersion).request(
      //   {
      //     command: Commands.CMD_HTTP_PATCH_APP_STORE_VERSION_UPDATE,
      //     value: {
      //       url: this.getPath(appVersionLocalization.links.self),
      //       patchData: patchData,
      //     },
      //   },
      //   (response) => {
      //     if (response.code < 0) {
      //       Toaster.showToast("Operation failed.", Toaster.ERROR, 2000);
      //     } else {
      //       ViewController.setProgress(false);
      //     }
      //   }
      // );
    },

    getLanguage(locale) {
      const translation = new Translation();
      return translation.getLanguage(locale);
    },

    // loadAppVersionLocalizations() {
    //   ViewController.setProgress(true);

    //   IPCClient.instance(this.appVersion).request(
    //     {
    //       command: Commands.CMD_HTTP_GET_APP_STORE_VERSION_LOCALIZATIONS,
    //       value: this.getPath(
    //         this.appVersion.relationships.appStoreVersionLocalizations.links
    //           .related
    //       ),
    //     },
    //     (response) => {
    //       ViewController.setProgress(false);

    //       if (response.code < 0) {
    //         Toaster.showToast("Operation failed.", Toaster.ERROR, 2000);
    //       } else {
    //         this.appVersionLocalizations = response.data.data;
    //         if (this.appVersionLocalizations.length) {
    //           console.log(
    //             this.getAttributes(this.appVersionLocalizations[0]).locale
    //           );
    //         }
    //       }
    //     }
    //   );
    // },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(appInfo) {
      return App.getAttributes(appInfo) || {};
    },
  },
  mounted() {
    window.$(".ui.accordion").accordion();
    console.log("appversionlocalization");
    this.appInfo = this.appInfos;
    // this.loadAppVersionLocalizations();
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