<template>
  <div class="flex-container">
    <div class="flex-child">
      <ScreenshotSidebar @onNotifSelected="onNotifSelected" />
    </div>
    <div id="center" class="flex-child">
      <ScreenshotEditor :notifProp="notif" />
    </div>
  </div>
</template>

<script>
import ScreenshotSidebar from "@/renderer/components/screenshot/ScreenshotSidebar";
import ScreenshotEditor from "@/renderer/components/screenshot/ScreenshotEditor";
import { Log } from "@/shared/Logger";
export default {
  components: {
    ScreenshotSidebar,
    ScreenshotEditor,
  },

  data() {
    return {
      notif: {}
    };
  },

  computed: {
    isSidebarVisible() {
      return this.$store.state.appConfig.isSidebarVisible;
    },
  },

  methods: {
    onNotifSelected(notif) {
      this.notif = notif;
    },

    showAboutApp() {
      this.$store.dispatch("showAboutApp", true);
    },
  },
};
</script>

<style scoped>
.ui[class*="top attached"].menu {
  border-radius: 0;
}

.flex-container {
  display: flex;
}

#center {
  width: 100%;
}
</style>
