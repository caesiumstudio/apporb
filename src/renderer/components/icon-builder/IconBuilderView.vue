<template>
  <div class="flex-container">
    <div class="flex-child">
      <IconBuilderSidebar @onNotifSelected="onNotifSelected" />
    </div>
    <div id="center" class="flex-child">
      <IconBuilderEditor :notifProp="notif" />
    </div>
  </div>
</template>

<script>
import IconBuilderSidebar from "@/renderer/components/icon-builder/IconBuilderSidebar";
import IconBuilderEditor from "@/renderer/components/icon-builder/IconBuilderEditor";
import { Log } from "@/shared/Logger";
export default {
  components: {
    IconBuilderSidebar,
    IconBuilderEditor,
  },

  data() {
    return {
      notif: {},
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
