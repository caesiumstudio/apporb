<template>
  <div id="sidebar" class="ui large vertical menu inverted">
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
            @click="onTemplateConfigSelected(designTemplate)"
          >
            {{ designTemplate.name }}
          </a>
        </div>
        <div class="ui divider"></div>
      </div>
      <div class="menu app-header" @click="onLoadSavedConfigs">
        <a class="item active"><i class="sync icon"></i>Saved Configs</a>
      </div>
      <div class="menu">
        <div v-for="config in savedConfig" :key="config.id">
          <div class="ui divider"></div>
          <a
            :class="[
              'item',
              selectedId == config.name ? 'active app-selected' : '',
            ]"
            @click="onConfigSelected(config)"
          >
            {{ config.name }}
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
import { ScreenshotConfig } from "@/shared/ScreenshotConfig";

const TAG = "ScreenshotSidebar";

export default {
  components: {},
  props: {
    designTemplates: Array,
  },

  data() {
    return {
      savedConfig: [],
      selectedId: "",
    };
  },

  methods: {
    onLoadSavedConfigs() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_GET_ALL_SCREENSHOT_CONFIG,
          value: {},
        },
        (response) => {
          console.log(JSON.stringify(response));
          this.savedConfig = response;
        }
      );

      this.selectedId = "";
      this.$emit("onScreenshotSelected", {});
    },

    onConfigSelected(config) {
      this.selectedId = config.name;
      this.$emit("onConfigSelected", config);
    },

    onTemplateConfigSelected(config) {
      // selecting a design template creates an empty config for saving.
      this.selectedId = config.name;
      this.$emit(
        "onConfigSelected",
        new ScreenshotConfig("", "", config.cards)
      );
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
