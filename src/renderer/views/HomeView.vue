<template>
  <SettingsDialogs />
  <AboutDialog />
  <TopMenu />
</template>

<script lang="ts">

import { Commands } from "@/shared/constants/Commands";
import { defineComponent } from "vue";
import { ViewController } from "@/renderer/ViewController";
import TopMenu from "@/renderer/components/TopMenu.vue";
import SettingsDialogs from "@/renderer/components/dialogs/SettingsDialog.vue";
import AboutDialog from "@/renderer/components/dialogs/AboutDialog.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    TopMenu,
    SettingsDialogs,
    AboutDialog
  },
  methods: {
    onClick() {
      console.log('ipc');
      ViewController.instance().notify({ command: Commands.CMD_DARK_MODE, value: '' })
    }
  },
});
</script>
<style scoped>
</style>
