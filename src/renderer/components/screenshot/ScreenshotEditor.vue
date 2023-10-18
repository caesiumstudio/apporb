<template>
  <div class="container">
    <div class="ui grid">
      <div class="twelve wide column">
        <div class="ui">
          <div class="ui form">
            <div class="fields">
              <div class="field">
                <button
                  class="ui button blue"
                  @click="onExportSelectedScreenshot"
                >
                  Export Selected
                </button>
              </div>
              <div class="field">
                <input
                  type="text"
                  v-model="exportPath"
                  placeholder="Export path"
                />
              </div>
              <ScreenshotSaveConfig
                :card="selectedCardData"
                :designTemplates="designTemplates"
              />
            </div>
          </div>
          <!-- <div class="inline field"></div> -->
        </div>
        <div class="ui divider"></div>
        <div
          ref="editorView"
          @resize="updateEditorSize($event)"
          class="ui editor-view"
        >
          <template
            v-for="(designTemplate, index) in designTemplates"
            :key="index"
          >
            <div class="screens-container">
              <template
                v-for="(card, cardIndex) in designTemplate.cards"
                :key="cardIndex"
              >
                <div class="screenshot-card selected">
                  <div class="ui selected">
                    <div class="ui checkbox center aligned">
                      <input
                        type="checkbox"
                        :checked="selectedCardData.name == card.name"
                        name="example"
                      />
                      <label></label>
                    </div>
                  </div>
                  <ScreenshotCard
                    :config="card"
                    @onCardClicked="onCardClicked"
                  />
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="four wide column">
        <ScreenshotPreview
          :data="selectedCardData"
          @onDataChanged="onDataChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Commands } from "@/shared/constants/Commands";
import { Toaster } from "@/renderer/services/Toaster";
import { ViewController } from "@/renderer/ViewController";
import IPCClient from "@/renderer/ipc/IPCClient";
import ScreenshotPreview from "@/renderer/components/screenshot/ScreenshotData.vue";
import ScreenshotCard from "@/renderer/components/screenshot/ScreenshotCard.vue";
import domtoimage from "dom-to-image";
import ScreenshotSaveConfig from "@/renderer/components/screenshot/ScreenshotSaveConfig.vue";

export default {
  components: {
    ScreenshotPreview,
    ScreenshotCard,
    ScreenshotSaveConfig,
  },

  props: {
    propDesignTemplates: Array,
  },
  watch: {
    propDesignTemplates: {
      handler(newPropDesignTemplates) {
        this.designTemplates = newPropDesignTemplates;
      },
    },
  },
  data() {
    return {
      exportPath: "",
      previewImage: { img: null },
      selectedCardData: {},
      designTemplates: [],
    };
  },

  mounted() {
    window.$(".ui.accordion").accordion();
    window.addEventListener("resize", this.updateEditorSize);
    this.designTemplates = this.propDesignTemplates;

    let resizeObserver = new ResizeObserver((elem) => {
      setTimeout(this.updateEditorSize, 300);
    });
    resizeObserver.observe(this.$refs.editorView);
  },

  methods: {
    updateEditorSize() {
      const editorView = this.$refs.editorView;
      if (editorView) {
        const editorViewWidth = editorView.clientWidth;
        const screenshotContainers =
          document.querySelectorAll(".screens-container");
        for (let i = 0; i < screenshotContainers.length; i++) {
          screenshotContainers[i].style.width = editorViewWidth + "px";
        }
      }
    },

    onDataChanged(data) {
      this.selectedCardData = data;
      for (let i = 0; i < this.designTemplates.length; i++) {
        const designTemplate = this.designTemplates[i];
        for (let j = 0; j < designTemplate.cards.length; j++) {
          if (designTemplate.cards[j].name == data.name) {
            designTemplate.cards[j] = data;
          }
        }
      }
    },

    onCardClicked(cardData) {
      console.log("selected", JSON.stringify(cardData));
      this.selectedCardData = cardData;
    },

    onExportSelectedScreenshot() {
      if (this.exportPath.length < 5) {
        Toaster.showToast(
          "Something is wrong with the Export Path",
          Toaster.ERROR,
          5000
        );
        return;
      }

      ViewController.instance()
        .getVuexStore()
        .dispatch("setProgressState", true);

      const cardNode = document.querySelector("#" + this.selectedCardData.name);
      const dup = cardNode.cloneNode(true);
      document.body.appendChild(dup);
      dup.style.transform = "scale(1)";
      setTimeout(() => {
        this.onSave(dup);
      }, 300);
    },

    onSave(node) {
      domtoimage
        .toPng(node)
        .then((dataUrl) => {
          IPCClient.instance().request(
            {
              command: Commands.CMD_EXPORT_SCREENSHOT,
              value: {
                imageData: dataUrl,
                fullPath: this.exportPath + "/screenshot-1.png",
                size: { height: 2208, width: 1242 },
              },
            },
            (response) => {
              ViewController.instance()
                .getVuexStore()
                .dispatch("setProgressState", false);
              if (response.code < 0) {
                Toaster.showToast(response.message, Toaster.ERROR, 2000);
              } else {
                Toaster.showToast(response.message, Toaster.INFO, 2000);
              }
              document.body.removeChild(node);
            }
          );
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    },
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
  /* box-shadow: 0 0 red; */
  /* border: 1px solid black; */
  padding: 4px;
  margin-right: 8px;
  width: 250px;
  height: 480px;
}

.screens-container {
  display: flex;
  padding: 4px;
  overflow: auto;
}

.screens-container::-webkit-scrollbar {
  width: 2px;
  height: 4px;
  background-color: #ffffff;
}

#content {
  border: none;
}

.editor-view {
  overflow-y: scroll;
  height: calc(100vh - 108px);
  overflow: auto;
}

.container {
  margin: 8px;
}
</style>