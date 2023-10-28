<template>
  <div class="">
    <form class="ui form">
      <div class="field">
        <label>Text or HTML</label>
        <textarea
          :value="data.text"
          @mouseup="updateSelection($event)"
          @keyup="onTextUpdated($event, 'text', 'text')"
          rows="3"
          spellcheck="true"
        ></textarea>
      </div>
      <div class="field">
        <label>Text Color (CSS Style)</label>
        <div class="two fields">
          <div class="ten wide field">
            <input
              type="text"
              :value="getTextStyles()"
              @keyup="onCSSChanged($event, 'textStyles', 'color')"
            />
          </div>
          <div class="six wide field">
            <input
              id="color-picker"
              type="color"
              :value="getTextStyles()"
              @input="onColorPicker($event)"
            />
          </div>
        </div>
      </div>
      <div class="field">
        <label>Background</label>
        <input
          type="text"
          :value="getBackgroundValue()"
          @keyup="onCSSChanged($event, 'style', 'background')"
        />
      </div>
      <div class="field">
        <label>Size</label>
        <select id="size-selector" class="ui size dropdown">
          <option value="1284x2778">Portrait 1284x2778</option>
          <option value="1242x2208">Portrait 1242x2208</option>
          <option value="1350x2400">Portrait Ratio (9:16)</option>
        </select>
      </div>
      <div
        class="ui placeholder segment"
        @drop.prevent="onDrop"
        @dragover.prevent="dragOver"
      >
        <div class="ui icon header" @drop.prevent="onDrop">
          <i class="pdf image outline icon"></i>
          Drop app screenshot here.
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { Utils } from "@/shared/Utils";

export default {
  props: {
    data: Object,
  },
  data() {
    return {
      imgDataSrc: "",
    };
  },
  mounted() {
    window.$("#size-selector").dropdown({
      onChange: (value, text, $selectedItem) => {
        const parts = value.split("x");
        let cloneData = Utils.cloneObject(this.data);
        cloneData.size = {
          width: parseInt(parts[0]),
          height: parseInt(parts[1]),
        };
        this.$emit("onDataChanged", cloneData);
      },
    });
  },
  methods: {
    onTextUpdated(event, attr, value) {
      this.onTextChanged(event, attr, value);
    },
    updateSelection(event) {
      const textArea = event.target;
      const start = textArea.selectionStart;
      const finish = textArea.selectionEnd;
      const sel = textArea.value.substring(start, finish);
      console.log(sel);
    },
    onColorPicker(event) {
      console.log(event.target.value);
      this.updateCSSCardData("textStyles", "color", event.target.value);
    },

    getTextStyles() {
      if (this.data && this.data.textStyles) {
        return this.data.textStyles
          .replace("color: ", "")
          .replace(";", "")
          .trim();
      }
      return "";
    },

    getBackgroundValue() {
      if (this.data && this.data.style) {
        return this.data.style
          .replace("background: ", "")
          .replace(";", "")
          .trim();
      }
      return "";
    },

    dragOver() {
      console.log("dropping");
    },

    onDrop(event) {
      if (
        event &&
        event.dataTransfer &&
        event.dataTransfer.files &&
        event.dataTransfer.files.length
      ) {
        let files = event.dataTransfer.files;
        let filepaths = [];
        for (let i = 0; i < files.length; i++) {
          filepaths.push(files[i].path);
        }

        console.log(JSON.stringify(filepaths));
        let cloneData = Utils.cloneObject(this.data);
        cloneData.appImage = "file://" + filepaths[0];
        this.$emit("onDataChanged", cloneData);
      }
    },

    onTextChanged(event, attr, value) {
      let cloneData = Utils.cloneObject(this.data);
      cloneData[attr] = event.target.value;
      this.$emit("onDataChanged", cloneData);
    },

    onCSSChanged(event, attr, value) {
      this.updateCSSCardData(attr, value, event.target.value);
    },

    updateCSSCardData(attr, cssAttr, cssValue) {
      let cloneData = Utils.cloneObject(this.data);
      cloneData[attr] = cssAttr + ": " + cssValue;
      this.$emit("onDataChanged", cloneData);
    },
  },
  watch: {
    previewImage: {
      handler(newPreviewImage) {
        this.imgDataSrc = newPreviewImage.img;
      },
    },
  },
};
</script>
<style scoped>
#editor {
  border: 1px solid #e0e0e0;
  padding: 4px;
  height: 120px;
}
#color-picker {
  height: 36px;
  /* width: 36px; */
}
</style>