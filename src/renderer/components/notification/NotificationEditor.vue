<template>
  <div class="container">
    <div v-show="notif" class="ui grid">
      <div class="ten wide column">

        <form class="ui form">
          <div class="field">
            <label>Name</label>
            <div class="two fields">
              <div class="field">
                <input v-model="notif.title" type="text" placeholder="name" />
              </div>
              <div class="field">
                <button type="button" class="ui button primary" @click="onNotificationSave">
                  Save
                </button>
                &nbsp;
                <button type="button" class="ui button primary" @click="onNotifSaveAsNew">
                  Save As New
                </button>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Authorization Key</label>
            <div class="fields">
              <div class="sixteen wide field">
                <input v-model="notif.authKey" type="text" />
              </div>
            </div>
            <div class="field">
              <label>Topic</label>
              <div class="two fields">
                <div class="field">
                  <input v-model="notif.topic" type="text" placeholder="topic" />
                </div>
                <div class="field">
                  <input type="text" />
                </div>
              </div>
            </div>

            <div class="ui segment field">
              <label>Notification JSON</label>
              <CodeMirrorVue :jsonText="notif.notifJson || '{}'" @onChange="onNotifChange" />
            </div>

            <div class="ui segment field">
              <label>Notification Data JSON</label>
              <CodeMirrorVue :jsonText="notif.dataJson || '{}'" @onChange="onNotifDataChange" />
            </div>

            <div class="field">
              <button type="button" class="ui button primary" @click="onSendNotification">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="six wide column">
        <NotificationHistory :history="notif.history" />
      </div>
    </div>
  </div>
</template>

<script>
import IPCClient from "@/renderer/ipc/IPCClient";
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
import { Utils } from "@/shared/Utils";
import CodeMirrorVue from "./CodeMirror.vue";
import NotificationHistory from "./NotificationHistory.vue";
export default {
  components: {
    CodeMirrorVue,
    NotificationHistory,
  },

  data() {
    return {
      notif: {},
    };
  },

  props: {
    notifProp: Object,
  },

  watch: {
    notifProp: {
      handler(newNotifProp) {
        this.notif = newNotifProp;
        console.log(JSON.stringify(newNotifProp));
      },
    },
  },

  methods: {
    onNotifSaveAsNew() {
      const notif = Utils.cloneObject(this.notif);
      delete notif._id;
      notif.id = Utils.getUID();

      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_NOTIFICATION,
          value: notif,
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

    onNotificationSave() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_NOTIFICATION,
          value: Utils.cloneObject(this.notif),
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

    onNotifChange(text) {
      console.log("notif", text);
      this.notif.notifJson = text;
    },

    onNotifDataChange(text) {
      console.log("data", text);
      this.notif.dataJson = text;
    },

    updateJsonData(value) {
      console.log(value);
    },

    onSendNotification() {
      const postData = this.getPostData();
      if (!postData) return;

      ViewController.setProgress(true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_POST_NOTIFICATION,
          value: {
            url: "https://fcm.googleapis.com/fcm/send",
            postData: postData,
            authKey: "key=" + this.notif.authKey,
          },
        },
        (respJson) => {
          ViewController.setProgress(false);

          console.log(JSON.stringify(respJson));
          if (respJson.code < 0) {
            Toaster.showToast(respJson.error, Toaster.ERROR, 1000);
          } else {
            this.notif.history.push({
              id: Utils.getUID(),
              title: postData.notification.title,
              timestamp: Utils.getTimestamp(),
              status: "SENT",
              messageId: respJson.data.message_id,
            });
          }
        }
      );
    },

    getPostData() {
      try {
        const postData = {
          to: "/topics/" + this.notif.topic,
          notification: Utils.cloneObject(JSON.parse(this.notif.notifJson)),
          data: Utils.cloneObject(JSON.parse(this.notif.dataJson)),
        };
        return postData;
      } catch (e) {
        Toaster.showToast(
          "Invalid JSON for notification data.",
          Toaster.ERROR,
          2000
        );
      }
      return null;
    },
  },

  mounted() {
    window.$(".ui.accordion").accordion();
  },

  computed: {
    darkMode() {
      return this.$store.state.appConfig.darkMode;
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  padding: 8px 8px 128px 8px;
}

#content {
  border: none;
}
</style>