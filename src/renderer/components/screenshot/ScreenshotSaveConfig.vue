<template>
  <span class="ui right floated">
    <button class="ui button green right floated" @click="onSaveConfig">
      Save Config {{ card.name ? card.name : "" }}
    </button>
  </span>
</template>
<script>
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
import { Utils } from "@/shared/Utils";
import IPCClient from "@/renderer/ipc/IPCClient";

export default {
  props: {
    card: Object,
    designTemplates: Array,
  },

  methods: {
    onSaveConfig() {
      if (Utils.isEmpty(this.card)) return;
      console.log(JSON.stringify(this.card));

      const cardClone = Utils.cloneObject(this.card);
      const cardRow = this.getCardRow(cardClone);

      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_SCREENSHOT,
          value: {
            name: "Harmonium",
            id: Utils.getUID(),
            designTemplates: Utils.cloneObject(cardRow),
          },
        },
        (response) => {
          ViewController.instance()
            .getVuexStore()
            .dispatch("setProgressState", false);
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
