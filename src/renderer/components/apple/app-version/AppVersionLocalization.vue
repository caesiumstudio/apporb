<template>
  <div>
    <div class="ui">
      <AppVersionTopMenuVue
        :appVersionLocalizations="appVersionLocalizations"
        :appVersion="appVersion"
      ></AppVersionTopMenuVue>
    </div>

    <div class="ui">
      <div
        v-for="(appVersionLocalization, index) in appVersionLocalizations"
        :key="appVersionLocalization.id"
      >
        <div class="ui accordion">
          <div class="title">
            <i class="dropdown icon"></i>
            {{
              getLanguage(getAttributes(appVersionLocalization).locale) +
              " (" +
              getAttributes(appVersionLocalization).locale +
              ")"
            }}
          </div>
          <div class="content">
            <div class="ui">
              <div class="ui form">
                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="getAttributes(appVersionLocalization).description"
                    spellcheck="true"
                  ></textarea>
                </div>

                <div class="field">
                  <label>Keywords</label>
                  <input
                    type="text"
                    v-model="getAttributes(appVersionLocalization).keywords"
                  />
                </div>

                <div class="field">
                  <label>Marketing URL</label>
                  <input
                    type="text"
                    v-model="getAttributes(appVersionLocalization).marketingUrl"
                  />
                </div>

                <div class="field">
                  <label>Promotional Text</label>
                  <textarea
                    v-model="
                      getAttributes(appVersionLocalization).promotionalText
                    "
                    rows="2"
                    spellcheck="true"
                  >
                  </textarea>
                </div>
                <div class="field">
                  <label>What's New</label>
                  <textarea
                    v-model="getAttributes(appVersionLocalization).whatsNew"
                    rows="2"
                    spellcheck="true"
                  >
                  </textarea>
                  <div class="field"></div>
                  <button
                    class="ui mini primary button mb-3"
                    @click="saveTranslation(index)"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <!-- <div class="ui divider"></div> -->
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
import AppVersionTopMenuVue from "./AppVersionTopMenu.vue";
import { ViewController } from "@/renderer/ViewController";
export default {
  components: {
    AppVersionTopMenuVue,
  },

  data() {
    return {
      appVersionLocalizations: [],
      loaderConfig: {
        isIconVisible: true,
        text: "Loading apps data",
      },
    };
  },

  props: {
    appVersion: Object,
  },

  mounted() {
    window.$(".ui.accordion").accordion();
    this.loadAppVersionLocalizations();
  },

  methods: {
    saveTranslation(index) {
      ViewController.setProgress(true);

      const appVersionLocalization = this.appVersionLocalizations[index];
      let attributes = this.getAttributes(appVersionLocalization);
      attributes = JSON.parse(JSON.stringify(attributes));
      delete attributes.locale;

      const patchData = {
        data: {
          type: "appStoreVersionLocalizations",
          id: appVersionLocalization.id,
          attributes: JSON.parse(JSON.stringify(attributes)),
        },
      };

      // in the first release whatsNew cannot be set so delete it.
      if (!patchData.data.attributes.whatsNew) {
        delete patchData.data.attributes.whatsNew;
      }

      IPCClient.instance(this.appVersion).request(
        {
          command: Commands.CMD_HTTP_PATCH_APP_STORE_VERSION_UPDATE,
          value: {
            url: this.getPath(appVersionLocalization.links.self),
            patchData: patchData,
          },
        },
        (response) => {
          if (response.code < 0) {
            Toaster.showToast("Operation failed.", Toaster.ERROR, 2000);
          } else {
            Toaster.showToast("Operation Success.", Toaster.SUCCESS, 1000);
            ViewController.setProgress(false);
          }
        }
      );
    },

    getLanguage(locale) {
      const translation = new Translation();
      return translation.getLanguage(locale);
    },

    loadAppVersionLocalizations() {
      ViewController.setProgress(true);

      IPCClient.instance(this.appVersion).request(
        {
          command: Commands.CMD_HTTP_GET_APP_STORE_VERSION_LOCALIZATIONS,
          value: this.getPath(
            this.appVersion.relationships.appStoreVersionLocalizations.links
              .related
          ),
        },
        (response) => {
          ViewController.setProgress(false);

          if (response.code < 0) {
            Toaster.showToast("Operation failed.", Toaster.ERROR, 2000);
          } else {
            this.appVersionLocalizations = response.data.data;
            if (this.appVersionLocalizations.length) {
              console.log(
                this.getAttributes(this.appVersionLocalizations[0]).locale
              );
            }
          }
        }
      );
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(appVersion) {
      return App.getAttributes(appVersion);
    },
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