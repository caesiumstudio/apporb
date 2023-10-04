<template>
  <div class="flex-container">
    <div class="flex-child">
      <NotificationSidebar @onNotifSelected="onNotifSelected" />
    </div>
    <div id="center" class="flex-child">
      <NotificationEditor :notif="notif" />
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
      console.log('selected: ' + notif.title);
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
