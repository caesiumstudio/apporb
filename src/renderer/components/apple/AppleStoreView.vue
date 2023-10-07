<template>
  <div class="flex-container">
    <div class="flex-child">
      <Sidebar @onAppSelected="onAppSelected" />
    </div>
    <div id="center" class="flex-child">
      <AppInfo :app="app" />
    </div>
  </div>
</template>
<script>
import Sidebar from "@/renderer/components/apple/AppSidebar";
import AppInfo from "@/renderer/components/apple/AppInfo";
export default {
  components: {
    Sidebar,
    AppInfo,
  },

  props: {
    searchTerm: String,
    sortBy: String,
    fileTypeFilter: Object,
  },

  data() {
    return {
      app: {},
    };
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
