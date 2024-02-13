<template>
  <div class="">
    <div class="ui small inverted  menu ">
      <!-- <a class="active item">
        Home
      </a>
      <a class="item">
        Messages
      </a> -->
      <div class="right menu">
        <div class="ui dropdown item borderless">
          Language <i class="dropdown icon"></i>
          <div class="menu">
            <a class="item" id="idShowReplied">{{ hideReplied ? "Show" : "Hide" }} Replied</a>
            <a class="item" id="idNot5Stars">{{ hide5Stars ? "Show" : "Hide" }} 5 Stars</a>
          </div>
        </div>
        <!-- <div class="item">
          <div class="ui primary button">Sign Up</div>
        </div> -->
      </div>
    </div>
    <div v-if="Object.keys(app).length">
      <template v-for="review in customerReviews" :key="review.id">
        <app-review-card :review="review" :hideReplied="hideReplied" :hide5Stars="hide5Stars" />
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
      hideReplied: false,
      hide5Stars: false,
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
      ViewController.setProgress(true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_GET_ALL_APP_STORE_REVIEWS,
          value: this.getPath(app.relationships.customerReviews.links.related),
        },
        (response) => {
          ViewController.setProgress(false);

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
    window.$(".dropdown").dropdown({
      onChange: (value, text, $selectedItem) => {
        this.transAttr = value;
        const id = $selectedItem[0].getAttribute("id")
        if (id === 'idShowReplied') {
          this.hideReplied = !this.hideReplied;
        } else if (id === 'idNot5Stars') {
          this.hide5Stars = !this.hide5Stars;
        }
      },
    });
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