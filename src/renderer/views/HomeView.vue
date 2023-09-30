<template>
  <SettingsDialogs />
  <TopMenu />
</template>

<script lang="ts">

import { Commands } from "@/shared/constants/Commands";
import { defineComponent } from "vue";
import { ViewController } from "../ViewController";
import TopMenu from "@/renderer/components/TopMenu.vue";
import SettingsDialogs from "@/renderer/components/dialogs/SettingsDialogs.vue";

declare const $: any;
export default defineComponent({
  name: "HomeView",
  components: {
    TopMenu,
    SettingsDialogs
  },
  methods: {
    onClick() {
      console.log('ipc');
      ViewController.instance().notify({ command: Commands.CMD_DARK_MODE, value: '' })
    }
  },
  mounted() {
    $('.menu .item')
      .tab();
  }
});
</script>
<style scoped>
</style>
