<template>
  <div class="ui tiny modal about-dialog">
    <div id="about-header" class="ui center aligned">
      <div class="ui icon header center aligned">
        <img src="icon.png" /> {{ aboutData.NAME }}
      </div>
    </div>
    <div class="ui divider"></div>

    <div class="image content">
      <table>
        <tr>
          <td>Creator</td>
          <td>
            <div class="ui small header">{{ aboutData.COMPANY_NAME }}</div>
          </td>
        </tr>
        <tr>
          <td>Website</td>
          <td colspan="2">
            <a href="#" @click="openLink(aboutData.WEBSITE)">{{
              aboutData.WEBSITE
            }}</a>
          </td>
        </tr>
        <tr>
          <td>Email</td>
          <td>
            <a href="#" @click="openLink('mailto:' + aboutData.EMAIL)">{{
              aboutData.EMAIL
            }}</a>
          </td>
        </tr>
        <tr>
          <td>Version</td>
          <td>
            {{ aboutData.VERSION }}
          </td>
        </tr>
        <tr>
          <td>License</td>
          <td>
            {{ aboutData.LICENSE }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            {{ aboutData.ALL_RIGHTS_RESERVED }}
          </td>
        </tr>
      </table>
    </div>

    <div class="ui vertical segment center aligned">
      <div class="ui small header">Please report issues here</div>
      <a href="#" @click="openLink(aboutData.GITHUB_ISSUE)">
        Github Issues Page
      </a>
    </div>
    <div v-show="aboutApp"></div>
  </div>
</template>
<script>
import { AppData } from "@/shared/constants/AppData";
import { Log } from "@/shared/Logger";
import { Utils } from "@/shared/Utils";
import { Platform } from "@/shared/Platform";

export default {
  data() {
    return {
      aboutData: {},
    };
  },
  computed: {
    aboutApp() {
      Log.debug("About", "show about computing");
      if (this.$store.state.appConfig.toggleAboutDialog) {
        console.log("showing");
        this.showAboutAppDialog();
      }
      return this.$store.state.appConfig.toggleAboutDialog;
    },
  },

  methods: {
    isNotWindows() {
      return !Platform.isWindowsOS();
    },

    openLink(link) {
      Utils.openLinkExternal(link);
    },

    showAboutAppDialog() {
      let about = this;
      window
        .$(".ui.tiny.modal.about-dialog")
        .modal({
          onHide: () => {
            about.$store.dispatch("toggleAboutDialog", false);
          },
          centered: false,
        })
        .modal("setting", "transition", "fade")
        .modal("show");
    },
  },

  mounted() {
    this.aboutData = AppData;
  },
};
</script>
<style scoped>
#about-header {
  background: white;
  display: flex;
  padding-top: 20px;
}
.ui.icon.header {
  text-align: left;
}
#donation-header {
  margin-top: 16px;
}
table {
  width: 100%;
}
td {
  padding-right: 20px;
}
</style>
