<template>
  <div>
    <div class="ui fixed top menu inverted">
      <div class="header item" id="menu">
        <i id="sidebar-button" class="globe icon"></i> AppOrb
      </div>
      <div class="right menu">
        <div
          id="sort-button"
          class="ui icon item"
          @click="toggleSettingsDialog"
        >
          <i class="settings icon"></i>
        </div>
      </div>
    </div>

    <ProgressBar />
    <AppleStoreView />
  </div>
</template>

<script>
import AppleStoreView from "@/renderer/components/AppleStoreView";
import { ViewController } from "@/renderer/ViewController";
import ProgressBar from "@/renderer/components/ProgressBar.vue";
export default {
  components: {
    AppleStoreView,
    ProgressBar,
  },

  mounted() {
    window.$("#sort-button").on("mouseup", () => {
      window.$("#sort-button.ui.dropdown.icon").dropdown({
        transition: "slide",
      });
    });
  },
  methods: {
    toggleSettingsDialog() {
      ViewController.instance().getVuexStore().dispatch("toggleSettingsDialog");
    },
    loadApps() {
      ViewController.instance().loadApps();
    },
  },

  computed: {},
};
</script>
<style scoped>
.ui[class*="top attached"].menu {
  border-radius: 0;
}
.flex-container {
  display: flex;
  margin-top: 40px;
}
#center {
  width: 100%;
}
#book-store-caption {
  margin-left: 8px;
}
</style>