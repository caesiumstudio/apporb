<template>
  <div class="ui small card fluid">
    <div class="content">
      <div class="header">
        {{ getAttributes(review).title }}
        <div class="right floated">
          {{ getAttributes(review).rating }} <i class="star orange icon"></i>
        </div>
      </div>
      <div class="meta">
        <span class="category"
          >{{ getAttributes(review).reviewerNickname }}
          <div class="right floated author">
            {{ getAttributes(review).createdDate }}
            {{ getAttributes(review).territory }}
          </div>
        </span>
      </div>
      <div class="description">{{ getAttributes(review).body }}</div>
    </div>
    <div class="extra content">
      <div class="ui form">
        <div class="field">
          <label>Response</label>
          <textarea
            @keyup="onTextModified"
            v-model="response"
            rows="2"
            spellcheck="true"
          ></textarea>
        </div>
        <div class="field">
          <button
            :disabled="isModified"
            :class="['ui mini button primary', {disabled: isUnmodified}]"
            @click="onSubmitResponse"
          >
            Save Response
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { App, APPLE_DEV_HOST } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ViewController } from "@/renderer/ViewController";
import { Toaster } from "@/renderer/services/Toaster";
export default {
  components: {},

  data() {
    return {
      response: "",
      isUnmodified: true,
    };
  },

  props: {
    review: Object,
  },

  watch: {
    review: {
      handler(newReview) {
        this.loadResponse(newReview);
      },
    },
  },
  mounted() {
    this.loadResponse(this.review);
  },
  methods: {
    onTextModified() {
      this.isUnmodified = false;
    },
    onSubmitResponse() {
      ViewController.instance()
        .getVuexStore()
        .dispatch("setProgressState", false);

      const postData = {
        data: {
          type: "customerReviewResponses",
          attributes: {
            responseBody: this.response,
          },
          relationships: {
            review: {
              data: {
                type: "customerReviews",
                id: this.review.id,
              },
            },
          },
        },
      };

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_POST_APP_STORE_REVIEW_RESPONSE,
          value: {
            url: "https://api.appstoreconnect.apple.com/v1/customerReviewResponses",
            postData: postData,
          },
        },
        (response) => {
          ViewController.instance()
            .getVuexStore()
            .dispatch("setProgressState", false);

          if (response.code < 0) {
            console.log(JSON.stringify(response));
          } else {
            Toaster.showToast("Updated successfully.", Toaster.INFO, 2000);
            this.isUnmodified = true;
          }
        }
      );
    },

    loadResponse(review) {
      ViewController.instance()
        .getVuexStore()
        .dispatch("setProgressState", true);

      IPCClient.instance().request(
        {
          command: Commands.CMD_HTTP_GET_APP_REVIEW_RESPONSE,
          value: this.getPath(review.relationships.response.links.related),
        },
        (response) => {
          ViewController.instance()
            .getVuexStore()
            .dispatch("setProgressState", false);

          if (response.code < 0) {
            Toaster.showToast(response.error, Toaster.ERROR, 3000);
          } else if (response.data.data != null) {
            this.response = this.getAttributes(response.data.data).responseBody;
          }
        }
      );
    },

    getPath(url) {
      return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
    },

    getAttributes(app) {
      return App.getAttributes(app) || {};
    },
  },
};
</script>