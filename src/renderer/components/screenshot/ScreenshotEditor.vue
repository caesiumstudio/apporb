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
              <ScreenshotSaveConfig :savedConfig="savedConfig" />
              <div class="field">
                <select class="ui size dropdown">
                  <option value="1284x2778">Portrait 1284x2778</option>
                  <option value="1242x2208">Portrait 1242x2208</option>
                  <option value="1350x2400">Portrait Ratio (9:16)</option>
                </select>
              </div>
            </div>
          </div>
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
                <div class="screenshot-card">
                  <div
                    :class="[
                      'card-wrapper',
                      selectedCardData.name == card.name ? 'selected' : '',
                    ]"
                  >
                    <ScreenshotCard
                      :config="card"
                      @onCardClicked="onCardClicked"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="four wide column">
        <ScreenshotData
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
import { Utils } from "@/shared/Utils";
import { ScreenshotConfig } from "@/shared/ScreenshotConfig";
import IPCClient from "@/renderer/ipc/IPCClient";
import ScreenshotData from "@/renderer/components/screenshot/ScreenshotData.vue";
import ScreenshotCard from "@/renderer/components/screenshot/ScreenshotCard.vue";
import domtoimage from "dom-to-image";
import ScreenshotSaveConfig from "@/renderer/components/screenshot/ScreenshotSaveConfig.vue";

export default {
  components: {
    ScreenshotData,
    ScreenshotCard,
    ScreenshotSaveConfig,
  },

  props: {
    designTemplateConfig: Object,
  },

  watch: {
    designTemplateConfig: {
      deep: true,
      handler(newTemplateConfig) {
        this.designTemplates = newTemplateConfig.cards;
        this.setTemplateSize();

        this.savedConfig = newTemplateConfig.id
          ? newTemplateConfig // already saved config
          : new ScreenshotConfig( // new config
              newTemplateConfig.id,
              newTemplateConfig.name,
              []
            );
      },
    },
  },

  data() {
    return {
      exportPath: "",
      savedConfig: { id: "", name: "", cards: [] },
      selectedCardData: {},
      designTemplates: [],
      cardSize: {
        width: "",
        height: "",
      },
      screenshotSize: {
        width: 1284,
        height: 2778,
      },
    };
  },

  mounted() {
    window.$(".ui.accordion").accordion();
    window.addEventListener("resize", this.updateEditorSize);

    const vueComponent = this;
    window.$(".ui.dropdown").dropdown({
      onChange: (value, text, $selectedItem) => {
        const parts = value.split("x");
        vueComponent.screenshotSize = {
          width: parseInt(parts[0]),
          height: parseInt(parts[1]),
        };
        vueComponent.setTemplateSize();
      },
    });

    this.designTemplates = this.propDesignTemplates;

    let resizeObserver = new ResizeObserver((elem) => {
      setTimeout(this.updateEditorSize, 300);
    });
    resizeObserver.observe(this.$refs.editorView);
  },

  methods: {
    setTemplateSize() {
      this.designTemplates.forEach((template) => {
        console.log(template);
        template.cards.forEach((card) => {
          card.size = this.screenshotSize;

          this.cardSize = {
            width: parseInt(this.screenshotSize.width) * 0.2 + "px",
            height: parseInt(this.screenshotSize.height) * 0.2 + "px",
          };
          console.log(JSON.stringify(this.cardSize));
        });
      });
    },

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
      this.savedConfig.cards = this.getCardRow(cardData);
    },

    getCardRow(card) {
      for (let i = 0; i < this.designTemplates.length; i++) {
        const designTemplate = this.designTemplates[i];
        for (let j = 0; j < designTemplate.cards.length; j++) {
          if (designTemplate.cards[j].name == card.name) {
            return [designTemplate];
          }
        }
      }
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

      ViewController.setProgress(true);

      const cardNode = document.querySelector("#" + this.selectedCardData.name);
      if (!cardNode) {
        Toaster.showToast("No card is selected", Toaster.ERROR, 2000);
        return;
      }

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
                size: Utils.cloneObject(this.screenshotSize),
              },
            },
            (response) => {
              ViewController.setProgress(false);

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
.selected {
  box-shadow: 0px 0px 0px 4px #2185d0 !important;
}

.card-wrapper {
  box-shadow: 0 0 9px 0px #bbbbbb;
  width: v-bind("cardSize.width");
  height: v-bind("cardSize.height");
}
.screenshot-card {
  margin: 6px;
  width: v-bind("cardSize.width");
  height: v-bind("cardSize.height");
}

.screens-container {
  display: flex;
  padding: 6px 0;
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