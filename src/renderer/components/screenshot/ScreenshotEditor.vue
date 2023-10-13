<template>
  <div class="container">
    <!-- <div class="ui grid">
      <div class="sixteen wide column"> -->
    <button class="ui button primary" @click="onConvertToPng">To PNG</button>
    <button class="ui button primary" @click="onSave">Save</button>
    <!-- <div class="ui header">Screenshot Editor</div> -->
    <div class="ui divider"></div>

    <div id="screen-1" class="screen-slider">
      <ScreenshotCard />
    </div>
  </div>
  <!-- <div class="six wide column">
        <ScreenshotPreview :previewImage="previewImage" />
      </div> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
// import ScreenshotPreview from "@/renderer/components/screenshot/ScreenshotPreview.vue";
import ScreenshotCard from "@/renderer/components/screenshot/ScreenshotCard.vue";
import domtoimage from "dom-to-image";

export default {
  components: {
    // ScreenshotPreview,
    ScreenshotCard,
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
        .toPng(node.firstChild, { width: 1242, height: 2208 })
        .then((dataUrl) => {
          var img = new Image();
          img.src = dataUrl;
          this.previewImage.img = dataUrl;
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    },
    onSave() {
      var node = document.getElementById("screen-1");
      // node.firstChild.style.width = '1242px';
      // node.firstChild.style.height = '2208px';
      const dup = node.firstChild.cloneNode(true);

      node.appendChild(dup);
      dup.style.transform = "scale(1)";
      // node.firstChild.style.transform = 'scale(1)';

      domtoimage
        .toPng(dup)
        .then((dataUrl) => {
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