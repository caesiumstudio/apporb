<template>
  <div>
    <div class="ui fixed top menu inverted">
      <div class="header item" id="menu">
        <i id="sidebar-button" class="globe icon"></i> AppOrb
      </div>

      <div id="apple-bookshelf" title="AppStore Manager" @click="setPlatform('APPLE')"
        :class="['ui icon item dropdown', { active: contentView === 'APPLE' }]">
        <i class="apple icon"></i>
      </div>

      <div id="android-bookshelf" v-if="false" title="PlayStore Console Manager" :class="[
        'ui icon item dropdown',
        { active: contentView === 'ANDROID' },
      ]" @click="setPlatform('ANDROID')">
        <i class="android icon"></i>
      </div>

      <div id="notification-bookshelf" title="Firebase Notification Manager" @click="setPlatform('NOTIFICATION')" :class="[
        'ui icon item dropdown',
        { active: contentView === 'NOTIFICATION' },
      ]">
        <i class="bell outline icon"></i>
      </div>
      <div id="notification-bookshelf" title="Screenshot Editor" @click="setPlatform('SCREENSHOT')" :class="[
        'ui icon item dropdown',
        { active: contentView === 'SCREENSHOT' },
      ]">
        <i class="image outline icon"></i>
      </div>
      <div class="right menu">
        <div id="sort-button" class="ui icon item" @click="toggleSettingsDialog">
          <i class="settings icon"></i>
        </div>
      </div>
    </div>

    <ProgressBar />
    <AppleStoreView v-show="contentView == 'APPLE'" />
    <NotificationView v-show="contentView == 'NOTIFICATION'" />
    <ScreenshotView v-show="contentView == 'SCREENSHOT'" />
    
  </div>
</template>

<script>
import { ViewController } from "@/renderer/ViewController";
import AppleStoreView from "@/renderer/components/apple/AppleStoreView";
import NotificationView from "@/renderer/components/notification/NotificationView.vue";
import ScreenshotView  from "@/renderer/components/screenshot/ScreenshotView.vue";

import ProgressBar from "@/renderer/components/ProgressBar.vue";
export default {
  data() {
    return {
      contentView: "APPLE",
    };
  },
  components: {
    AppleStoreView,
    NotificationView,
    ProgressBar,
    ScreenshotView
  },

  mounted() {
    window.$("#sort-button").on("mouseup", () => {
      window.$("#sort-button.ui.dropdown.icon").dropdown({
        transition: "slide",
      });
    });
  },

  methods: {
    setPlatform(contentView) {
      console.log(contentView);
      this.contentView = contentView;
    },
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