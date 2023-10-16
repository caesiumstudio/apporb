<template>
  <div class="flex-container">
    <div>
      <ScreenshotSidebar
        :designTemplates="designTemplates"
        @onDesignTemplateSelected="onDesignTemplateSelected"
      />
    </div>
    <div id="center">
      <ScreenshotEditor :propDesignTemplates="selectedDesignTemplate" />
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
      selectedDesignTemplate: [],
    };
  },

  computed: {
    isSidebarVisible() {
      return this.$store.state.appConfig.isSidebarVisible;
    },
  },

  mounted() {
    this.designTemplates.push({
      name: "Gradient",
      designTemplates: this.getDesignTemplates(),
    });
    this.designTemplates.push({
      name: "Artistic",
      designTemplates: this.getArtisticTemplates(),
    });
  },
  methods: {
    onDesignTemplateSelected(designTemplate) {
      this.selectedDesignTemplate = designTemplate;
    },

    getArtisticTemplates() {
      const designTemplates = [];
      const config = [
        {
          name: "sunset",
          style: "background: url('assets/screenshots/artistic.png')",
        },
        {
          name: "aqua",
          style: "background: url('assets/screenshots/artistic1.png');",
        },
      ];

      for (let i = 0; i < config.length; i++) {
        const designTemplate = {};
        const cards = [];
        for (let j = 0; j < 5; j++) {
          let card = {
            name: config[i].name + "-" + j,
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
          name: "sunset",
          style: "background: linear-gradient(40deg, #ffd86f, #fc6262);",
        },
        {
          name: "aqua",
          style: "background: linear-gradient(40deg, #2096ff,#05ffa3);",
        },
        {
          name: "purple",
          style: "background: linear-gradient(40deg, #ff6ec4, #7873f5); ",
        },
        {
          name: "warm-flame",
          style:
            "background: linear-gradient(45deg,#ff9a9e 0,#fad0c4 99%,#fad0c4 100%); ",
        },
        {
          name: "night-fade",
          style: "background: linear-gradient(to top,#a18cd1 0,#fbc2eb 100%); ",
        },
        {
          name: "spring",
          style: "background: linear-gradient(to top,#fad0c4 0,#ffd1ff 100%);",
        },
        {
          name: "young-passion",
          style:
            "background: linear-gradient(to top,#ff8177 0,#ff867a 0,#ff8c7f 21%,#f99185 52%,#cf556c 78%,#b12a5b 100%);",
        },
        {
          name: "rainy-ashville",
          style: "background: linear-gradient(to top,#fbc2eb 0,#a6c1ee 100%);",
        },
        {
          name: "runny-morning",
          style: "background: linear-gradient(120deg,#f6d365 0,#fda085 100%);",
        },
        {
          name: "dusty-grass",
          style: "background: linear-gradient(120deg,#d4fc79 0,#96e6a1 100%);",
        },
        {
          name: "deep-blue",
          style: "background: linear-gradient(120deg,#e0c3fc 0,#8ec5fc 100%);",
        },
        {
          name: "heavy-rain",
          style: "background: linear-gradient(to top,#cfd9df 0,#e2ebf0 100%);",
        },
      ];

      for (let i = 0; i < config.length; i++) {
        const designTemplate = {};
        const cards = [];
        for (let j = 0; j < 8; j++) {
          let card = {
            name: config[i].name + "-" + j,
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
  flex-direction: row;
}

#center {
  width: 100%;
}
</style>
