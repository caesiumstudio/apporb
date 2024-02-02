<template>
  <div>
    <div class="ui">
      <AppInfoTopMenu
        :appInfoLocalizations="appInfoLocalizations"
      ></AppInfoTopMenu>
    </div>

    <div class="ui">
      <div
        v-for="(appInfoLocalization, index) in appInfoLocalizations"
        :key="index"
      >
        <div class="ui accordion">
          <div class="title">
            <i class="dropdown icon"></i>
            {{
              getLanguage(getAttributes(appInfoLocalization).locale) +
              " (" +
              getAttributes(appInfoLocalization).locale +
              ")"
            }}
          </div>
          <div class="content">
            <div class="ui">
              <div class="ui form">
                <div class="field">
                  <label>Title ({{ evaluator.nameCharLeft }})</label>
                  <input
                    type="text"
                    :class="{ error: !evaluator.isValidName }"
                    @keyup="onChange(appInfoLocalization)"
                    v-model="getAttributes(appInfoLocalization).name"
                    spellcheck="true"
                  />
                </div>
                <div class="field">
                  <label>Subtitle ({{ evaluator.subtitleCharLeft }})</label>
                  <input
                    type="text"
                    :class="{ error: !evaluator.isValidSubtitle }"
                    @keyup="onChange(appInfoLocalization)"
                    v-model="getAttributes(appInfoLocalization).subtitle"
                    spellcheck="true"
                  />
                </div>
                <div class="field">
                  <label>Privacy Policy Url</label>
                  <input
                    type="text"
                    v-model="
                      getAttributes(appInfoLocalization).privacyPolicyUrl
                    "
                    spellcheck="true"
                  />
                </div>
                <div class="field">
                  <button
                    class="ui mini primary button mb-3"
                    @click="saveTranslation(appInfoLocalization)"
                  >
                    Save
                  </button>
                </div>
              </div>
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
import AppInfoTopMenu from "./AppInfoTopMenu";

export default {
  components: { AppInfoTopMenu },

  data() {
    return {
      evaluator: {
        isValidName: true,
        isValidSubtitle: true,
        nameCharLeft: 30,
        subtitleCharLeft: 30,
      },

      appInfoLocalizations: [],
      loaderConfig: {
        isIconVisible: true,
        text: "Loading apps data",
      },
    };
  },

  props: {
    appInfo: Object,
  },

  watch: {
    appInfos: {
      handler(newAppInfo) {
        console.log(JSON.stringify(newAppInfo));
        this.loadAppInfoLocalizations();
      },
    },
  },

  methods: {
    onChange(appInfoLocalization) {
      const attr = this.getAttributes(appInfoLocalization);

      this.evaluator.nameCharLeft = 30 - attr.name.length;
      this.evaluator.subtitleCharLeft = 30 - attr.subtitle.length;

      this.evaluator.isValidName = this.evaluator.nameCharLeft >= 0;
      this.evaluator.isValidSubtitle = this.evaluator.subtitleCharLeft >= 0;
    },

    loadAppInfoLocalizations() {
      ViewController.setProgress(true);
      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_GET_APP_INFO_LOCALIZATIONS,
          value: this.getPath(
            this.appInfo.relationships.appInfoLocalizations.links.related
          ),
        },
        (response) => {
          ViewController.setProgress(false);

          if (response.code < 0) {
            Toaster.showToast(response.error, Toaster.ERROR, 3000);
          } else {
            const localizations = response.data.data;
            for (let i = 0; i < localizations.length; i++) {
              if (localizations[i].attributes.locale === 'en-US') {
                this.appInfoLocalizations.unshift(localizations[i]);
                continue;
              }
              this.appInfoLocalizations.push(localizations[i]);
            }
          }
        }
      );
    },

    saveTranslation(appInfo) {
      ViewController.setProgress(true);

      let attributes = this.getAttributes(appInfo);
      attributes = JSON.parse(JSON.stringify(attributes));
      delete attributes.locale;
      delete attributes.privacyChoicesUrl;
      delete attributes.privacyPolicyText;
      delete attributes.privacyPolicyUrl;

      const patchData = {
        data: {
          type: "appInfoLocalizations",
          id: appInfo.id,
          attributes: attributes,
        },
      };

      IPCClient.instance(this.appVersion).request(
        {
          command: Commands.CMD_HTTP_PATCH_APP_INFO_UPDATE,
          value: {
            url: this.getPath(appInfo.links.self),
            patchData: patchData,
          },
        },
        (response) => {
          ViewController.setProgress(false);
          console.log(JSON.stringify(response));
          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 2000);
          }
          {
            Toaster.showToast(response.message, Toaster.INFO, 2000);
          }
        }
      );
    },

    getLanguage(locale) {
      const translation = new Translation();
      return translation.getLanguage(locale);
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(appInfo) {
      return App.getAttributes(appInfo) || {};
    },
  },
  mounted() {
    window.$(".ui.accordion").accordion();
    this.loadAppInfoLocalizations();
  },
  computed: {
    darkMode() {
      return this.$store.state.appConfig.darkMode;
    },
  },
};
</script>

<style scoped>
.error {
  border: 1px dashed rgb(251 0 0) !important;
}
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