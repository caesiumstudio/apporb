<template>
  <div id="sidebar" class="ui large vertical menu">
    <div class="item">
      <div class="menu">
        <a class="item active">Saved Notifications</a>
      </div>

      <div class="menu">
        <div class="ui divider">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Log } from "@/shared/Logger";
import { App } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ViewController } from "@/renderer/ViewController";

const TAG = "AppSidebar";

export default {
  components: {},
  data() {
    return {
      apps: [],
      selectedAppId: "",
    };
  },

  methods: {},
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
