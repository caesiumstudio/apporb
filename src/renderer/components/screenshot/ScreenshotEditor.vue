<template>
  <div class="container">
    <div class="ui grid">
      <div class="twelve wide column">
        <button class="ui button primary" @click="onConvertToPng">To PNG</button>
        <button class="ui button primary" @click="onSave">Save</button>
        <!-- <div class="ui header">Screenshot Editor</div> -->
        <div class="ui divider"></div>

        <div class="editor-view">
          <div class="screens-container">
            <div class="screenshot-card">
              <ScreenshotCard ref="card" />
            </div>
            <div class="screenshot-card">
              <ScreenshotCard />
            </div>
            <div class="screenshot-card">
              <ScreenshotCard />
            </div>
            <div class="screenshot-card">
              <ScreenshotCard />
            </div>
            <div class="screenshot-card">
              <ScreenshotCard />
            </div>
            <div class="screenshot-card">
              <ScreenshotCard />
            </div>
          </div>          
        </div>
      </div>
      <div class="four wide column">
        <ScreenshotPreview :previewImage="previewImage" />
      </div>
    </div>
  </div>
</template>

<script>
import ScreenshotPreview from "@/renderer/components/screenshot/ScreenshotPreview.vue";
import ScreenshotCard from "@/renderer/components/screenshot/ScreenshotCard.vue";
import domtoimage from "dom-to-image";

export default {
  components: {
    ScreenshotPreview,
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
      var node = document.getElementById("card");

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
      var node = document.getElementsByClassName("screenshot")[0];
      // node.firstChild.style.width = '1242px';
      // node.firstChild.style.height = '2208px';
      const dup = node.cloneNode(true);

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
.screenshot-card {
  width: 260px;
  height: 460px;
}

.screens-container {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  overflow-x: scroll;
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

.editor-view {
  overflow-y: scroll;
  /* height: 85vh; */
}
</style>