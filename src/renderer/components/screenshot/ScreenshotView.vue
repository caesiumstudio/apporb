<template>
  <div class="flex-container">
    <div>
      <ScreenshotSidebar :designTemplates="designTemplates" @onConfigSelected="onConfigSelected" />
    </div>
    <div id="center">
      <ScreenshotEditor :designTemplateConfig="selectedDesignTemplate" />
    </div>
  </div>
</template>

<script>
import ScreenshotSidebar from "@/renderer/components/screenshot/ScreenshotSidebar";
import ScreenshotEditor from "@/renderer/components/screenshot/ScreenshotEditor";
import { GradientTemplates } from "@/renderer/components/screenshot/designTemplates/GradientTemplates";
import { ArtisticTemplates } from "@/renderer/components/screenshot/designTemplates/ArtisticTemplates";
import { DesignTemplate } from "@/shared/DesignTemplate";
import { PatternTemplates } from "@/renderer/components/screenshot/designTemplates/PatternTemplates";
import { PastelTemplates } from "@/renderer/components/screenshot/designTemplates/PastelTemplates";

export default {
  components: {
    ScreenshotSidebar,
    ScreenshotEditor,
  },

  data() {
    return {
      designTemplates: [],
      selectedDesignTemplate: {},
    };
  },

  computed: {
    isSidebarVisible() {
      return this.$store.state.appConfig.isSidebarVisible;
    },
  },

  mounted() {
    this.designTemplates.push({
      name: GradientTemplates.name,
      cards: this.loadTemplates(GradientTemplates.cards),
    });
    // this.designTemplates.push({
    //   name: ArtisticTemplates.name,
    //   cards: this.loadTemplates(ArtisticTemplates.cards),
    // });
    this.designTemplates.push({
      name: PatternTemplates.name,
      cards: this.loadTemplates(PatternTemplates.cards),
    });
    this.designTemplates.push({
      name: PastelTemplates.name,
      cards: this.loadTemplates(PastelTemplates.cards),
    });
  },

  methods: {
    onConfigSelected(designTemplate) {
      this.selectedDesignTemplate = designTemplate;
    },

    loadTemplates(designTemplates) {
      const templateCards = [];
      for (let i = 0; i < designTemplates.length; i++) {
        const cards = [];
        for (let j = 0; j < 5; j++) {
          cards.push(new DesignTemplate(designTemplates[i], j).getData());
        }
        templateCards.push({ id: "", name: "", cards: cards });
      }
      return templateCards;
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
