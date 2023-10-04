<template>
  <div class="flex-container">
    <div class="flex-child">
      <NotificationSidebar />
    </div>
    <div id="center" class="flex-child">
      <NotificationEditor @onNotificationSent="onNotificationSent" />
    </div>
  </div>
</template>
<script>
import NotificationSidebar from "@/renderer/components/notification/NotificationSidebar";
import NotificationEditor from "@/renderer/components/notification/NotificationEditor";
import { Log } from "@/shared/Logger";
export default {
  components: {
    NotificationSidebar,
    NotificationEditor,
  },

  data() {
    return {};
  },

  computed: {
    isSidebarVisible() {
      return this.$store.state.appConfig.isSidebarVisible;
    },
  },

  methods: {
    onAppSelected(app) {
      this.app = app;
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
