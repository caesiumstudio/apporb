<template>
  <div class="flex-container">
    <div class="flex-child">
      <ScreenshotSidebar @onScreenshotSelected="onScreenshotSelected" />
    </div>
    <div id="center" class="flex-child">
      <ScreenshotEditor :propDesignTemplates="designTemplates" />
    </div>
  </div>
</template>

<script>
import ScreenshotSidebar from "@/renderer/components/screenshot/ScreenshotSidebar";
import ScreenshotEditor from "@/renderer/components/screenshot/ScreenshotEditor";
export default {
  components: {
    ScreenshotSidebar,
    ScreenshotEditor,
  },

  data() {
    return {
      designTemplates: [],
    };
  },

  computed: {
    isSidebarVisible() {
      return this.$store.state.appConfig.isSidebarVisible;
    },
  },

  methods: {
    onScreenshotSelected(screenshot) {
      this.screenshot = screenshot;
      if (screenshot.id == "gradient") {
        this.designTemplates = this.getDesignTemplates();
      } else if (screenshot.id == "artistic") {
        this.designTemplates = this.getArtisticTemplates();
      }
    },

    getArtisticTemplates() {
      const designTemplates = [];
      const config = [
        {
          id: "sunset-",
          style: "background: url('assets/screenshots/artistic.png')",
        },
        {
          id: "aqua-",
          style: "background: url('assets/screenshots/artistic1.png');",
        },
      ];

      for (let i = 0; i < config.length; i++) {
        const designTemplate = {};
        const cards = [];
        for (let j = 0; j < 5; j++) {
          let card = {
            id: config[i].id + "-" + j,
            text: "Heading text goes here",
            appImage: "assets/placeholders/iphone12/screenshot.png",
            bezel: "assets/placeholders/iphone12/iphone12.png",
            style: config[i].style,
            textStyles: "color: white;",
          };
          cards.push(card);
        }
        designTemplate.cards = cards;
        designTemplates.push(designTemplate);
      }
      return designTemplates;
    },

    getDesignTemplates() {
      const designTemplates = [];
      const config = [
        {
          id: "sunset-",
          style: "background: linear-gradient(40deg, #ffd86f, #fc6262);",
        },
        {
          id: "aqua-",
          style: "background: linear-gradient(40deg, #2096ff,#05ffa3);",
        },
        {
          id: "purple-",
          style: "background: linear-gradient(40deg, #ff6ec4, #7873f5); ",
        },
        {
          id: "warm-flame-",
          style:
            "background: linear-gradient(45deg,#ff9a9e 0,#fad0c4 99%,#fad0c4 100%); ",
        },
        {
          id: "night-fade-",
          style: "background: linear-gradient(to top,#a18cd1 0,#fbc2eb 100%); ",
        },
        {
          id: "spring-",
          style: "background: linear-gradient(to top,#fad0c4 0,#ffd1ff 100%);",
        },
        {
          id: "young-passion-",
          style:
            "background: linear-gradient(to top,#ff8177 0,#ff867a 0,#ff8c7f 21%,#f99185 52%,#cf556c 78%,#b12a5b 100%);",
        },
        {
          id: "rainy-ashville-",
          style: "background: linear-gradient(to top,#fbc2eb 0,#a6c1ee 100%);",
        },
        {
          id: "runny-morning-",
          style: "background: linear-gradient(120deg,#f6d365 0,#fda085 100%);",
        },
        {
          id: "dusty-grass-",
          style: "background: linear-gradient(120deg,#d4fc79 0,#96e6a1 100%);",
        },
        {
          id: "deep-blue-",
          style: "background: linear-gradient(120deg,#e0c3fc 0,#8ec5fc 100%);",
        },
        {
          id: "heavy-rain-",
          style: "background: linear-gradient(to top,#cfd9df 0,#e2ebf0 100%);",
        },
      ];

      for (let i = 0; i < config.length; i++) {
        const designTemplate = {};
        const cards = [];
        for (let j = 0; j < 5; j++) {
          let card = {
            id: config[i].id + "-" + j,
            text: "Heading text goes here",
            appImage: "assets/placeholders/iphone12/screenshot.png",
            bezel: "assets/placeholders/iphone12/iphone12.png",
            style: config[i].style,
            textStyles: "color: white;",
          };
          cards.push(card);
        }
        designTemplate.cards = cards;
        designTemplates.push(designTemplate);
      }
      return designTemplates;
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
