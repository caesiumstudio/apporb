<template>
  <div class="">
    <div v-if="Object.keys(app).length">
      <template v-for="review in customerReviews" :key="review.id">
        <app-review-card :review="review"/>
      </template>
    </div>
  </div>
</template>

<script>
import { App, APPLE_DEV_HOST } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ViewController } from "@/renderer/ViewController";
import { Toaster } from "@/renderer/services/Toaster";

import AppReviewCard from "./AppReviewCard.vue";

export default {
  components: { AppReviewCard },

  data() {
    return {
      customerReviews: [],
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

  watch: {
    app: {
      handler(newApp) {
        this.loadCustomerReviews(newApp);
      },
    },
  },

  methods: {
    loadCustomerReviews(app) {
      ViewController.instance()
        .getVuexStore()
        .dispatch("setProgressState", true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_GET_ALL_APP_STORE_REVIEWS,
          value: this.getPath(app.relationships.customerReviews.links.related),
        },
        (response) => {
          ViewController.instance()
            .getVuexStore()
            .dispatch("setProgressState", false);

          if (response.code < 0) {
            Toaster.showToast(response.error, Toaster.ERROR, 3000);
          } else {
            this.customerReviews = response.data.data;
          }
        }
      );
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(jsonObject) {
      return App.getAttributes(jsonObject) || {};
    },
  },

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