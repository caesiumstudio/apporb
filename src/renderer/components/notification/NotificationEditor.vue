<template>
  <div class="container">
    <div v-if="notif" class="ui grid">
      <div class="ten wide column">
        <!-- <div class="ui header">Notification Editor</div>
        <div class="ui divider"></div> -->

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
              </div>
            </div>
          </div>
          <div class="field">
            <label>Authorization Key</label>
            <div class="fields">
              <div class="sixteen wide field">
                <input v-model="authKey" type="text" />
              </div>
            </div>
            <div class="field">
              <label>Topic</label>
              <div class="two fields">
                <div class="field">
                  <input v-model="topic" type="text" placeholder="topic" />
                </div>
                <div class="field">
                  <input type="text" />
                </div>
              </div>
            </div>

            <div class="ui segment field">
              <label>Notification JSON</label>
              <CodeMirrorVue :jsonText="jsonNotif" @onChange="onNotifChange" />
            </div>

            <div class="ui segment field">
              <label>Notification Data JSON</label>
              <CodeMirrorVue :jsonText="jsonNotifData" @onChange="onNotifDataChange" />
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
        <NotificationHistory :history="history" />
      </div>
    </div>
  </div>
</template>

<script>
import IPCClient from "@/renderer/ipc/IPCClient";
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
import { Utils } from '@/shared/Utils';
import CodeMirrorVue from "./CodeMirror.vue";
import NotificationHistory from "./NotificationHistory.vue";
export default {
  components: {
    CodeMirrorVue,
    NotificationHistory,
  },

  data() {
    return {
      notif: null,
      notifId: Utils.getUID(),
      history: [],
      topic: "testdebug",
      title: "Test name",
      authKey: "",
      jsonNotif: '{ "title": "title", "body": "body"}',
      jsonNotifData:
        '{"title": "title", "message": "message", "url": "https://www.youtube.com/watch?v=ia64t7GYsIs"}',
    };
  },

  props: {
    notifProp: Object,
  },
  watch: {
    notifProp: {
      handler(newNotif) {
        this.notif = this.clone(newNotif);
      },
    },
  },
  methods: {
    onNotificationSave() {
      const notif = {
        id: this.notifId,
        topic: this.topic,
        title: this.title,
        authKey: this.authKey,
        notifJson: this.jsonNotif,
        dataJsno: this.jsonNotifData,
        history: JSON.parse(JSON.stringify(this.history))
      };

      IPCClient.instance().request(
        {
          command: Commands.CMD_SAVE_NOTIFICATION,
          value: notif,
        },
        (response) => {
          console.log(JSON.stringify(response));
        }
      );
    },
    onNotifChange(text) {
      console.log("notif", text);
      this.jsonNotif = text;
    },
    onNotifDataChange(text) {
      console.log("data", text);
      this.jsonNotifData = text;
    },

    updateJsonData(value) {
      console.log(value);
    },

    onSendNotification() {
      ViewController.instance()
        .getVuexStore()
        .dispatch("setProgressState", true);

      const postData = this.getPostData();
      if (!postData) return;

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_POST_NOTIFICATION,
          value: {
            url: "https://fcm.googleapis.com/fcm/send",
            postData: postData,
            authKey: this.authKey,
          },
        },
        (response) => {
          ViewController.instance()
            .getVuexStore()
            .dispatch("setProgressState", false);
          console.log(JSON.stringify(response));
          this.history.push({
            id: Utils.getUID(),
            title: postData.notification.title,
            timestamp: this.getTimestamp(),
            status: "SENT",
            messageId: JSON.parse(response).message_id
          });
        }
      );
    },

    getTimestamp() {
      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      return datetime;
    },

    getPostData() {
      try {
        const postData = {
          to: "/topics/" + this.topic,
          notification: this.clone(JSON.parse(this.jsonNotif)),
          //   android: {
          //     notification: {
          //       color: "#bcbf01",
          //       icon: "stock_ticker_update",
          //       imageUrl:
          //         "https://raw.githubusercontent.com/caesiumstudio/apporb/main/public/icon.png",
          //       time_to_live: 5,
          //     },
          //   },
          android: {
            notification: {
              imageUrl:
                "https://raw.githubusercontent.com/caesiumstudio/apporb/main/public/icon.png",
            },
          },

          data: this.clone(JSON.parse(this.jsonNotifData)),
          //   webpush: {
          //     headers: {
          //       TTL: "5",
          //     },
          //   },
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

    clone(json) {
      return JSON.parse(JSON.stringify(json));
    },
  },

  mounted() {
    window.$(".ui.accordion").accordion();
    // for (let i = 0; i < 100; i++) {
    //   this.history.push({ title: "sfsfd", id: "sfsdf", time: "sdfsdfsdf" });
    // }
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