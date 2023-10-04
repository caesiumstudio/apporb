<template>
  <div id="sidebar" class="ui large vertical menu">
    <div class="item">
      <div class="menu app-header" @click="onLoadApps">
        <a class="item active"><i class="sync icon"></i>Load Apps</a>
      </div>

      <div class="menu">
        <div v-for="notif in notifArray" :key="notif.id">
          <div class="ui divider"></div>
          <a :class="[
            'item',
            selectedNotifId == notif.id
              ? 'active app-selected'
              : '',
          ]" @click="onNotifSelected(notif)">
            {{ notif.title }}
          </a>
        </div>
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
      notifArray: [],
      selectedNotifId: "",
    };
  },

  methods: {
    onNotifSelected(notif) {
      this.notif = notif;
      this.selectedNotifId = notif.id;
      this.$emit('onNotifSelected', notif);
    }
  },
  mounted() {
    IPCClient.instance().request(
      {
        command: Commands.CMD_GET_ALL_NOTIFICATIONS,
        value: {},
      },
      (response) => {
        console.log(JSON.stringify(response));
        this.notifArray = response;
        // this.$emit('onNotifSelected', this.notifArray[0]);
        // this.onNotifSelected(this.notifArray[0]);
      }
    );
  }
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
