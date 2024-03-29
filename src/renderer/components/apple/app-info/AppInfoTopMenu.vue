<template>
  <div>
    <div class="app-menu">
      <!-- <div class="ui button primary" @click="addAllLanguages()">
          Add All Languages
        </div> -->
      <div class="ui button primary" @click="generateTranslations">
        Generate Translations
      </div>

      <div class="ui divider hidden"></div>
      <div class="ui form">
        <div class="field">
          <label>Select attributes to translate</label>
          <select
            :id="'dd-' + uid"
            name="Update attributes"
            multiple=""
            class="ui fluid multiple selection dropdown"
          >
            <option value=""></option>
            <option value="name">App Name</option>
            <option value="subtitle">Sub Title</option>
          </select>
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
  data() {
    return {
      uid: Date.now(),
      transAttr: [],
    };
  },

  props: {
    appInfoLocalizations: Object,
  },

  mounted() {
    this.transAttr = [];
    window.$("#dd-" + this.uid).dropdown({
      onChange: (value) => {
        this.transAttr = value;
      },
    });
  },

  methods: {
    generateTranslations() {
      const englishAttr = this.getEnglishVersion();
      if (!englishAttr) {
        Toaster.showToast("No english version found.", Toaster.ERROR, 2000);
        return;
      }

      if (!this.transAttr.length) {
        Toaster.showToast(
          "Select attributes to translate.",
          Toaster.INFO,
          2000
        );
        return;
      }

      for (let i = 0; i < this.appInfoLocalizations.length; i++) {
        const loc = this.appInfoLocalizations[i];
        const attr = this.getAttributes(loc);
        if (attr.locale == "en-US") continue;

        this.transAttr.forEach((attribName) => {
          this.updateTranslatedText(
            englishAttr[attribName].replaceAll("\n", "{|}"),
            attr.locale,
            (result) => {
              for (let i = 0; i < this.appInfoLocalizations.length; i++) {
                const loc = this.appInfoLocalizations[i];
                const attr = this.getAttributes(loc);
                if (attr.locale === result.locale) {
                  let translatedText = result.payload.replaceAll("{|}", "\n");
                  const charLimit = {
                    keywords: 170,
                    promotionalText: 170,
                    description: 4000,
                  };
                  if (charLimit[attribName]) {
                    attr[attribName] = this.trimText(
                      charLimit[attribName],
                      translatedText
                    );
                  } else {
                    attr[attribName] = translatedText;
                  }
                }
              }
            }
          );
        });
      }
    },

    async updateTranslatedText(text, locale, fun) {
      const translation = new Translation();
      await translation
        .googleTranslate(text, locale)
        .then((result) => {
          fun(result);
        })
        .catch((e) => {
          Toaster.showToast(e, Toaster.ERROR, 2000);
        });
    },

    trimText(numberOfChar, text) {
      text = text.substring(0, numberOfChar);
      return text.substring(0, text.lastIndexOf(" "));
    },

    getEnglishVersion() {
      for (let i = 0; i < this.appInfoLocalizations.length; i++) {
        const loc = this.appInfoLocalizations[i];
        const attr = this.getAttributes(loc);
        if (attr.locale === "en-US") {
          return attr;
        }
      }
      return null;
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(appVersion) {
      return App.getAttributes(appVersion);
    },

    addAllLanguages() {
      ViewController.setProgress(true);

      const appVersionLocalization = this.appInfoLocalizations;
      const existingLocale = [];
      for (let i = 0; i < this.appInfoLocalizations.length; i++) {
        existingLocale.push(
          this.getAttributes(appVersionLocalization[i]).locale
        );
      }

      for (let i = 0; i < Translation.APP_STORE_LOCALE.length; i++) {
        const locale = Translation.APP_STORE_LOCALE[i];

        if (existingLocale.includes(locale)) {
          console.log("found " + locale);
        } else {
          console.log("Add for locale: " + locale);
          this.addLanguage(locale);
        }
      }
      ViewController.setProgress(false);
    },

    addLanguage(locale) {
      ViewController.setProgress(true);
      const postData = {
        data: {
          type: "appStoreVersionLocalizations",
          attributes: {
            locale: locale,
            description:
              "Flitm: be curious - A coding app where you can learn any programming languages like HTML, CSS, Javascript, Java, and Python and build your professional software right from your mobile phone",
            keywords: "",
            marketingUrl: "https://caesiumstudio.com/app-details/flitm",
            promotionalText: "",
            supportUrl: "https://caesiumstudio.com/",
            whatsNew: "",
          },
          relationships: {
            appStoreVersion: {
              data: {
                type: "appStoreVersions",
                id: this.appVersion.id,
              },
            },
          },
        },
      };

      IPCClient.instance(this.appVersion).request(
        {
          command: Commands.CMD_HTTP_POST_APP_STORE_VERSION_CREATE,
          value: {
            url: "https://api.appstoreconnect.apple.com/v1/appStoreVersionLocalizations",
            postData: postData,
          },
        },
        (response) => {
          ViewController.setProgress(false);

          if (response.code < 0) {
            console.log(JSON.stringify(response));
          } else {
            console.log("success");
            Toaster.showToast("Updated successfully.", Toaster.INFO, 2000);
          }
        }
      );
    },
  },
};
</script>

<style scoped>
.app-menu {
  padding: 4px 0 4px 0;
}
</style>