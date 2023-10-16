<template>
  <div id="sidebar" class="ui large vertical menu">
    <div class="item">
      <div class="menu app-header">
        <a class="item active"><i class="sync icon"></i>Screenshots</a>
      </div>

      <div class="menu">
        <div v-for="designTemplate in designTemplates" :key="designTemplate.id">
          <div class="ui divider"></div>
          <a
            :class="[
              'item',
              selectedId == designTemplate.name ? 'active app-selected' : '',
            ]"
            @click="onScreenshotSelected(designTemplate)"
          >
            {{ designTemplate.name}}
          </a>
        </div>
        <div class="ui divider"></div>
      </div>
      <div class="menu app-header" @click="onLoadSavedScreenshotConfigs">
        <a class="item active"><i class="save icon"></i>Saved Configs</a>
      </div>
      <div class="menu">
        <div v-for="screenshot in savedScreenshotConfig" :key="screenshot.id">
          <div class="ui divider"></div>
          <a
            :class="[
              'item',
              selectedId == screenshot.id ? 'active app-selected' : '',
            ]"
            @click="onScreenshotSelected(screenshot)"
          >
            {{ screenshot.name }}
          </a>
        </div>
        <div class="ui divider"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";

const TAG = "ScreenshotSidebar";

export default {
  components: {},
  props: {
    designTemplates: Array
  },

  data() {
    return {
      savedScreenshotConfig: [],
      selectedId: "",
    };
  },

  methods: {
    onLoadSavedScreenshotConfigs() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_GET_ALL_SCREENSHOT_CONFIG,
          value: {},
        },
        (response) => {
          console.log(JSON.stringify(response));
          this.savedScreenshotConfig = response;
        }
      );

      this.selectedId = "";
      this.$emit("onScreenshotSelected", {});
    },

    onScreenshotSelected(screenshotConfig) {
      // this.screenshot = screenshot;
      this.selectedId = screenshotConfig.name;
      this.$emit("onDesignTemplateSelected", screenshotConfig.designTemplates);
    },
  },
};
</script>

<style scoped>
#sidebar {
  width: 240px;
  height: 100%;
  border-radius: 0;
}

.app-selected {
  font-weight: 700;
}

.app-header {
  margin: 0;
  font-size: 1.2em;
}
</style>
