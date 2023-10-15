<template>
  <div id="sidebar" class="ui large vertical menu">
    <div class="item">
      <div class="menu app-header" @click="onLoadScreenshots">
        <a class="item active"><i class="sync icon"></i>Screenshots</a>
      </div>

      <div class="menu">
        <div v-for="screenshot in screenshotArray" :key="screenshot.id">
          <div class="ui divider"></div>
          <a
            :class="[
              'item',
              selectedId == screenshot.id ? 'active app-selected' : '',
            ]"
            @click="onScreenshotSelected(screenshot)"
          >
            {{ screenshot.title }}
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
  data() {
    return {
      screenshotArray: [
        { title: "Gradient", id: "gradient" },
        { title: "Artistic", id: "artistic" },
      ],
      selectedId: "",
    };
  },

  methods: {
    onLoadScreenshots() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_GET_ALL_NOTIFICATIONS,
          value: {},
        },
        (response) => {
          console.log(JSON.stringify(response));
          this.notifArray = response;
        }
      );

      this.selectedId = "";
      this.$emit("onScreenshotSelected", {});
    },

    onScreenshotSelected(screenshot) {
      this.screenshot = screenshot;
      this.selectedId = screenshot.id;
      this.$emit("onScreenshotSelected", screenshot);
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
