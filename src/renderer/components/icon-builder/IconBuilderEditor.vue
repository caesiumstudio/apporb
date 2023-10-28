<template>
  <div class="container">
    <div class="ui grid">
      <div class="twelve wide column">
        <div class="icon-container">
          <div class="ui segment">
            <h3 class="h1">New App Icon</h3>

            <img
              v-if="iconPath"
              class="ui small rounded image"
              :src="getImagePath(iconPath)"
            />
          </div>
          <div class="ui segment">
            <h3 class="h1">Resource images</h3>

            <div class="ui basic five cards">
              <template
                v-for="(imagePath, arrayIndex) in appIconResolutions"
                :key="arrayIndex"
              >
                <div class="ui card medium">
                  <div class="image img-preview">
                    <img
                      :src="getImagePath(imagePath)"
                      class="img-preview"
                      :title="imagePath"
                    />
                  </div>
                  <div class="content">
                    <div class="" :title="imagePath">
                      {{ imagePath.substr(imagePath.lastIndexOf("/") + 1) }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="four wide column">
        <form class="ui segment form">
          <div class="field">
            <label>Export Path ($PROJECT/android/app/res)</label>
            <input v-model="exportPath" type="text" />
          </div>

          <div class="field">
            <div
              class="ui placeholder segment"
              @drop.prevent="onDrop"
              @dragover.prevent="dragOver"
            >
              <div class="ui icon header" @drop.prevent="onDrop">
                <i class="pdf image outline icon"></i>
                Drop Icon here.<br />
                (1024px:1024px)
              </div>
            </div>
          </div>

          <!-- <div class="field">
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
          </div> -->

          <div class="field">
            <button type="button" class="ui button primary" @click="onExport">
              Export
            </button>
            <button
              type="button"
              class="ui button green right floated"
              @click="onExportPathChange"
            >
              Refresh
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import IPCClient from "@/renderer/ipc/IPCClient";
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { Utils } from "@/shared/Utils";
export default {
  components: {},

  data() {
    return {
      exportPath: "/home/ravi/Downloads/aaaa/",
      iconPath: "icon-ph.png",
      appIconResolutions: ["icon-ph.png"],
    };
  },

  props: {
    // notifProp: Object,
  },

  // watch: {
  //   notifProp: {
  //     handler(newNotifProp) {
  // this.notif = newNotifProp;
  // console.log(JSON.stringify(newNotifProp));
  //     },
  //   },
  // },

  methods: {
    onExportPathChange() {
      IPCClient.instance().request(
        {
          command: Commands.CMD_GET_APP_ICON,
          value: {
            exportPath: this.exportPath,
          },
        },
        (response) => {
          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 2000);
          } else {
            this.appIconResolutions = response.data;
            Toaster.showToast(response.message, Toaster.INFO, 2000);
          }
        }
      );
    },

    onExport() {
      this.appIconResolutions = [];
      IPCClient.instance().request(
        {
          command: Commands.CMD_EXPORT_APP_ICON,
          value: {
            iconPath: this.iconPath,
            exportPath: this.exportPath,
          },
        },
        (response) => {
          if (response.code < 0) {
            Toaster.showToast(response.message, Toaster.ERROR, 2000);
          } else {
            this.appIconResolutions = response.data;
            Toaster.showToast(response.message, Toaster.INFO, 2000);
          }
        }
      );
    },

    getImagePath(path) {
      if (path === "icon-ph.png") return path;
      return "file://" + path + "?" + new Date().getTime();
    },
    dragOver() {
      console.log("dropping");
    },

    onDrop(event) {
      if (
        event &&
        event.dataTransfer &&
        event.dataTransfer.files &&
        event.dataTransfer.files.length
      ) {
        let files = event.dataTransfer.files;
        let filepaths = [];
        for (let i = 0; i < files.length; i++) {
          filepaths.push(files[i].path);
        }

        console.log(JSON.stringify(filepaths));

        this.iconPath = filepaths[0];
      }
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
.icon-container {
  height: calc(100vh - 42px);
  /* overflow-y: hidden; */
  overflow-x: hidden;
  /* width: 100%; */
}
.container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  padding: 8px 8px 128px 8px;
}
.img-preview {
  background-color: white;
}
#content {
  border: none;
}
</style>