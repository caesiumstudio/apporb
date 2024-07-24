<template>
  <div class="container">
    <div v-show="notif" class="ui grid content" >
      <div class="ten wide column notif-editor">
        <form class="ui form ">
          <div class="field">
            <!-- <label>Name</label> -->
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
            <label>Service account file path (*.json)</label>
            <div class="fields">
              <div class="sixteen wide field">
                <input v-model="notif.serviceAccountJsonPath" type="text" />
              </div>
            </div>
            <div class="field">

              <div class="two fields">
                <div class="field">
                  <label>Topic</label>
                  <input v-model="notif.topic" type="text" placeholder="topic" />
                </div>
                <div class="field">
                  <label>Token</label>
                  <input v-model="notif.token" type="text" placeholder="token" />
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
              <button type="button" class="ui button primary" @click="onSendNotification('topic')">
                Send to Topic
              </button>
              <button type="button" class="ui button primary" @click="onSendNotification('token')">
                Send to Token
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

    onSendNotification(sendType) {
      let postData = this.getPostData();
      if (!postData) return;

      if (sendType === 'token') {
        postData = JSON.parse(JSON.stringify(postData));
        delete postData.topic;
      } else if (sendType === 'topic') {
        postData = JSON.parse(JSON.stringify(postData));
        delete postData.token;
      }

      ViewController.setProgress(true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_POST_NOTIFICATION,
          value: {            
            postData: postData,            
          },
        },
        (respJson) => {
          ViewController.setProgress(false);

          console.log(JSON.stringify(respJson));
          if (respJson.code < 0) {
            Toaster.showToast(respJson.message, Toaster.ERROR, 1000);
          } else {
            Toaster.showToast(respJson.message, Toaster.SUCCESS, 1000);

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
          topic: this.notif.topic,
          token: this.notif.token,
          serviceAccountJsonPath: this.notif.serviceAccountJsonPath,
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
  height: 100%;
  width: 100%;
  /* min-height: 100%; */
  overflow: scroll;
  padding: 8px 8px 128px 8px;
}

.notif-editor {  
  height: calc(100vh - 32px);
  overflow: scroll;
}
.container {
  border: none;
  background-color: rgb(255, 255, 255);
}
</style>