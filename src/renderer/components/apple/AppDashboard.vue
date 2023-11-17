<template>
  <div class="container">
    <div v-show="Object.keys(app).length">
      <div class="ui pointing secondary menu">
        <a class="item active" data-tab="one">App Meta</a>
        <a class="item" data-tab="two">App Info</a>
        <a class="item" data-tab="three">Reviews</a>

      </div>
      <div class="ui tab active" data-tab="one">
        <app-versions :app="app" />
      </div>
      <div class="ui tab" data-tab="two">
        <AppInfoLocalizations :app="app" />
      </div>
      <div class="ui tab" data-tab="three">
        <app-reviews :app="app" />
      </div>

    </div>
    <div v-show="Object.keys(app).length == 0">
      <loader-view :config="loaderConfig" />
    </div>
  </div>
</template>

<script>
import LoaderView from "../LoaderView.vue";
import AppReviews from "./AppReviews.vue";
import AppVersions from "./AppVersions.vue";
import AppInfoLocalizations from "./AppInfoLocalizations.vue";
export default {
  components: { AppVersions, AppReviews, LoaderView, AppInfoLocalizations },

  data() {
    return {
      appVersions: [],
      selectedBookTitle: "",
      loaderConfig: {
        isIconVisible: false,
        text: "Load and select an app",
      },
    };
  },

  props: {
    app: Object,
  },

  methods: {},

  mounted() {
    window.$(".ui.accordion").accordion();
    window.$(".menu .item").tab();
  },

  computed: {
    darkMode() {
      return this.$store.state.appConfig.darkMode;
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  padding: 8px 8px 128px 8px;
}

#content {
  border: none;
}
</style>