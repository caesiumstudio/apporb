<template>
  <div class="field">
    <button class="ui button green" @click="onSaveConfig">
      Save Config {{ card.name ? card.name : "" }}
    </button>
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
    card: Object,
    designTemplates: Array,
  },

  data() {
    return {
      configName: "",
    };
  },
  methods: {
    onSaveConfig() {
      if (Utils.isEmpty(this.card) || this.configName.length < 3) {
        Toaster.showToast("Config name is empty", Toaster.ERROR, 2000);
        return;
      }

      const cardClone = Utils.cloneObject(this.card);
      const cardRow = this.getCardRow(cardClone);

      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_SCREENSHOT,
          value: new ScreenshotConfig(
            Utils.getUID(),
            this.configName,
            Utils.cloneObject(cardRow)
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

    getCardRow(card) {
      for (let i = 0; i < this.designTemplates.length; i++) {
        const designTemplate = this.designTemplates[i];
        for (let j = 0; j < designTemplate.cards.length; j++) {
          if (designTemplate.cards[j].name == card.name) {
            return [designTemplate];
          }
        }
      }
    },
  },
};
</script>
<style scoped>
</style>
