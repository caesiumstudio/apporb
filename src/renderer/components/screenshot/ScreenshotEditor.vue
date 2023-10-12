<template>
  <div class="container">
    <div class="ui grid">
      <div class="ten wide column">
        <button class="ui button basic" @click="onConvertToPng">To PNG</button>
        <!-- <div class="ui header">Screenshot Editor</div>
        <div class="ui divider"></div> -->

        <div id="screen-1" class="screen">
          <div class="headerText">Learn anything anywhere</div>
        </div>
      </div>
      <div class="six wide column">
        <ScreenshotPreview :previewImage="previewImage" />
      </div>
    </div>
  </div>
</template>

<script>
import ScreenshotPreview from "@/renderer/components/screenshot/ScreenshotPreview.vue";
import domtoimage from "dom-to-image";

export default {
  components: {
    ScreenshotPreview,
  },

  data() {
    return {
      previewImage: { img: null },
    };
  },

  // props: {
  //   notifProp: Object,
  // },

  // watch: {
  //   notifProp: {
  //     handler(newNotifProp) {
  //       this.notif = newNotifProp;
  //       console.log(JSON.stringify(newNotifProp));
  //     },
  //   },
  // },

  methods: {
    onConvertToPng() {
      var node = document.getElementById("screen-1");

      domtoimage
        .toPng(node)
        .then((dataUrl) => {
          var img = new Image();
          img.src = dataUrl;
          this.previewImage.img = dataUrl;

          let link = document.createElement("A");
          link.download = "screen-1.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    },
  },

  mounted() {
    window.$(".ui.accordion").accordion();
  },

  computed: {
    darkMode() {
      return this.$store.state.appConfig.darkMode;
    },
  },
};
</script>

<style scoped>
.headerText {
  color: white;
  /* font-weight: 900; */
  font-size: 30px;
  padding: 20px;
  line-height: 1;
}
.screen {
  margin-top: 8px;
  height: 736px;
  width: 414px;
  background-color: blue;
}
.container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  padding: 8px 8px 128px 8px;
}

#content {
  border: none;
}
</style>