<template>
  <div>
    <div class="ui">
      <AppVersionTopMenuVue :appVersionLocalizations="appVersionLocalizations" :appVersion="appVersion"
        @saveAll="saveAll">
      </AppVersionTopMenuVue>
    </div>

    <div class="ui">
      <div class="ui form">
        <div class="field">
          <label>Description Footer</label>
          <textarea :value="descriptionFooter.join('\n')" spellcheck="true">
      </textarea>
        </div>
      </div>
    </div>
    <div class="ui">
      <div v-for="(appVersionLocalization, index) in appVersionLocalizations" :key="appVersionLocalization.id">
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
                  <textarea @keyup="onChange($event, 4000)" v-model="getAttributes(appVersionLocalization).description"
                    spellcheck="true"></textarea>
                </div>

                <div class="field">
                  <label>Keywords</label>
                  <input @keyup="onChange($event, 100)" type="text"
                    v-model="getAttributes(appVersionLocalization).keywords" />
                </div>

                <div class="field">
                  <label>Marketing URL</label>
                  <input type="text" v-model="getAttributes(appVersionLocalization).marketingUrl" />
                </div>

                <div class="field">
                  <label>Promotional Text</label>
                  <textarea @keyup="onChange($event, 170)" v-model="getAttributes(appVersionLocalization).promotionalText
                    " rows="2" spellcheck="true">
                  </textarea>
                </div>
                <div class="field">
                  <label>What's New</label>
                  <textarea @keyup="onChange($event, 170)" v-model="getAttributes(appVersionLocalization).whatsNew"
                    rows="2" spellcheck="true">
                  </textarea>
                  <div class="field"></div>
                  <button class="ui mini primary button mb-3" @click="saveTranslation(index)">
                    Save
                  </button>
                  <button :class="['ui mini button primary']" @click="showChatView">
                    Ai
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
import { OrbAI } from "@/renderer/services/OrbAI";
export default {
  components: {
    AppVersionTopMenuVue,
  },

  data() {
    return {
      descriptionFooter: [
        "-------",
        "Developer contact: caesiumstudio@gmail.com",
        "Privacy Policy: https://www.caesiumstudio.com/privacy-policy",
        "End User License Agreement: https://www.caesiumstudio.com/eula/license"],
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
    showChatView() {
      new OrbAI().openChatView();
    },

    onChange(event, validLength) {
      const remainingLength = validLength - event.target.value.length;
      console.log("Remaining: " + remainingLength);
      if (remainingLength < 0) {
        event.target.style.border = '1px dotted red';
      } else {
        event.target.style.border = '';
      }
    },

    saveAll() {
      console.log('saving all');
      let versionIndex = 0;


      const callback = (msg) => {
        console.log('Status: ' + msg);
        versionIndex++;
        if (versionIndex < this.appVersionLocalizations.length) {
          this.saveTranslationWithCallback(versionIndex, callback);
        }
      }
      this.saveTranslationWithCallback(versionIndex, callback);
    },

    saveTranslation(index) {
      this.saveTranslationWithCallback(index, (msg) => {
        console.log('Status: ' + msg);
      });
    },

    removeFooter(description) {
      const index = description.indexOf('-------');
      if (index > 0) {
        return description.substring(0, description.indexOf('-------'));
      }
      return description.trim() + '\n\n';
    },

    saveTranslationWithCallback(index, callback) {
      ViewController.setProgress(true);

      const appVersionLocalization = this.appVersionLocalizations[index];
      let attributes = this.getAttributes(appVersionLocalization);
      attributes.description = this.removeFooter(attributes.description.toString());
      attributes.description += this.descriptionFooter.join('\n');
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
            callback(response.code);
            Toaster.showToast("Operation failed.", Toaster.ERROR, 2000);
          } else {
            Toaster.showToast("Operation Success.", Toaster.SUCCESS, 1000);
            ViewController.setProgress(false);
            callback(response.code);
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
            const localizations = response.data.data;
            for (let i = 0; i < localizations.length; i++) {
              if (localizations[i].attributes.locale === "en-US") {
                this.appVersionLocalizations.unshift(localizations[i]);
                continue;
              }
              this.appVersionLocalizations.push(localizations[i]);
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