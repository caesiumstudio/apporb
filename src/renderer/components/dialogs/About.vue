<template>
  <div class="ui tiny modal about-dialog">
    <div class="ui icon header">
      <img src="assets/icons/png/256x256.png" />
      {{ aboutData.NAME }}
    </div>
    <div class="image content">
      <table>
        <tr>
          <td colspan="2">
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

    <div v-if="isNotWindows()" class="ui vertical segment center aligned">
      <div class="ui horizontal divider">Support the project</div>
      <div
        class="ui center alinged labeled button"
        @click="openLink(aboutData.PATREON_PAGE)"
      >
        <div class="ui orange button"><i class="patreon icon"></i>Become</div>
        <a class="ui basic orange left pointing label" href="#">a Patreon </a>
      </div>
    </div>
    <div class="ui vertical segment center aligned">
      <div v-if="!isNotWindows()" class="ui divider"></div>
      <div class="ui small header">Please report issues here</div>
      <a href="#" @click="openLink(aboutData.GITHUB_ISSUE)">
        {{ aboutData.GITHUB_ISSUE }}
      </a>
    </div>
    <div v-show="aboutApp"></div>
  </div>
</template>
<script>
import { AppData } from "@/shared/constants/AppData";
import { Log } from "@/services/Logger";
import { Utils } from "@/shared/Utils";

export default {
  data() {
    return {
      aboutData: {},
    };
  },
  computed: {
    aboutApp() {
      Log.debug("About", "show about computing");
      if (this.$store.state.appConfig.isAboutDialogVisible) {
        this.showAboutAppDialog();
      }
      return this.$store.state.appConfig.isAboutDialogVisible;
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
      const $ = window.$;
      let about = this;
      $(".ui.tiny.modal.about-dialog")
        .modal({
          onHide: () => {
            about.$store.dispatch("showAboutAppDialog", false);
          },
          centered: false,
        })
        .modal("setting", "transition", "fade")
        .modal("show");
    },
  },

  mounted() {
    this.showAboutAppDialog();
  },
};
</script>
<style scoped>
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
