<template>
  <div class="ui longer scrolling modal settings-dialog">
    <div class="ui icon header">Settings</div>

    <div class="scrolling content">
      <form class="ui form">
        <h4 class="ui dividing header">App Connect Credentials</h4>
        <div class="field">
          <div class="two fields">
            <div class="field">
              <label>Key ID</label>
              <input
                v-model="keyID"
                type="text"
                name="key-id"
                placeholder="Key ID"
              />
            </div>
            <div class="field">
              <label>Issuer ID</label>
              <input
                v-model="issuerID"
                type="text"
                name="issuer-id"
                placeholder="Issuer ID"
              />
            </div>
          </div>
        </div>
        <div class="field">
          <label
            >Path to the authentication token signing key file (.p8 file)</label
          >
          <div class="fields">
            <div class="sixteen wide field">
              <input
                v-model="authTokenFilePath"
                type="text"
                name="auth-token-file"
                placeholder="Path to the authentication token signing key file"
              />
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="actions">
      <div class="ui gray deny button">Cancel</div>
      <div class="ui primary approve button" @click="saveSettings">Save</div>
    </div>
    <div v-show="isSettingsVisible"></div>
  </div>
</template>

<script>
import { Log } from "@/shared/Logger";
import IPCClient from "@/renderer/ipc/IPCClient";
import { Commands } from "@/shared/constants/Commands";

export default {
  data() {
    return {
      issuerID: "",
      keyID: "",
      authTokenFilePath: "",
    };
  },

  computed: {
    isSettingsVisible() {
      let appConfig = this.$store.state.appConfig;
      if (appConfig.toggleSettingsDialog) {
        this.showSettingsDialog();
      }
      return appConfig.toggleSettingsDialog;
    },
  },

  methods: {
    showSettingsDialog() {
      let vueComponent = this;

      window
        .$(".ui.modal.settings-dialog")
        .modal({
          onShow: () => vueComponent.onShowSettingsDialog(),
          onHide: () => vueComponent.onHideSettingsDialog(),
          centered: false,
          closable: false,
        })
        .modal("setting", "transition", "fade")
        .modal("show");
    },

    onShowSettingsDialog() {
      Log.debug("Settings", "Settings shown");
      IPCClient.instance().request(
        {
          command: Commands.CMD_LOAD_APP_CONNECT_API_CREDENTIALS,
          value: {},
        },
        (response) => {
          if (response.code >= 0) {
            response = response.data;
            this.authTokenFilePath = response.authTokenFilePath;
            this.keyID = response.keyID;
            this.issuerID = response.issuerID;
          }
        }
      );
    },

    onHideSettingsDialog() {
      this.$store.dispatch("toggleSettingsDialog");
    },

    saveSettings() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_APP_CONNECT_API_CREDENTIALS,
          value: {
            authTokenFilePath: this.authTokenFilePath,
            issuerID: this.issuerID,
            keyID: this.keyID,
          },
        },
        (response) => {
          console.log(response);
        }
      );
    },
  },
};
</script>

  <style scoped>
.ui.icon.header {
  text-align: left;
}
.width100 {
  width: 100%;
}
table {
  width: 100%;
}
td {
  padding-right: 20px;
}
</style>