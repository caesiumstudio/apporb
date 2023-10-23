<template>
  <div class="field">
    <button class="ui button green" @click="onSaveConfig">Save Config</button>
  </div>
  <div class="field">
    <input
      class="ui right floated"
      v-model="configName"
      type="text"
      placeholder="Config name"
    />
  </div>
</template>

<script>
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
import { Utils } from "@/shared/Utils";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ScreenshotConfig } from "@/shared/ScreenshotConfig";

export default {
  props: {
    savedConfig: Object,
  },

  watch: {
    savedConfig: {
      deep: true,
      handler(newSavedConfig) {
        this.configName = newSavedConfig.name;
      },
    },
  },
  data() {
    return {
      configName: "",
    };
  },

  methods: {
    onSaveConfig() {
      if (this.isInvalidData()) return;

      const savedConfig = Utils.cloneObject(this.savedConfig);
      savedConfig.name = this.configName;
      if (savedConfig._id) delete savedConfig._id;
      // inject new id if it is a new config
      if (!savedConfig.id) {
        savedConfig.id = Utils.getUID();
      }

      const config = IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_SCREENSHOT,
          value: new ScreenshotConfig(
            savedConfig.id,
            savedConfig.name,
            Utils.cloneObject(savedConfig.cards)
          ),
        },
        (response) => {
          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 2000);
          } else {
            Toaster.showToast(response.message, Toaster.INFO, 2000);
          }
        }
      );
    },

    isInvalidData() {
      let errorMessage = "";

      if (this.configName.length < 3) {
        errorMessage = "Config name is empty";
      }
      if (!errorMessage && this.savedConfig.cards.length === 0) {
        errorMessage = "No cards are selected";
      }

      if (errorMessage) {
        Toaster.showToast(errorMessage, Toaster.ERROR, 2000);
        return true;
      }
      return false;
    },
  },
};
</script>
<style scoped>
</style>
