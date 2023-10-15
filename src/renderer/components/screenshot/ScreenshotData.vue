<template>
  <div class="container">
    <form class="ui form">
      <h3 class="ui header">Screenshot Data</h3>
      <div class="field">
        <label>Text</label>
        <input type="text" :value="data.text" @keyup="onDataChanged($event, 'text')" />
      </div>
      <div class="field">
        <label>Text Color</label>
        <input
          type="text"
          :value="data.textStyles"
          @keyup="onDataChanged($event, 'textStyles')"
        />
      </div>
      <!-- <div class="field">
        <label>Background</label>
        <input
          type="text"
          :value="data.style"
          @keyup="onDataChanged($event, 'style')"
        />
      </div> -->
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
  methods: {
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
    // onTextColorChange(event) {
    //   let cloneData = Utils.cloneObject(this.data);
    //   cloneData.textStyles = event.target.value;
    //   this.$emit("onDataChanged", cloneData);
    // },
    // onBGColorChange(event) {
    //   let cloneData = Utils.cloneObject(this.data);
    //   cloneData.text = event.target.value;
    //   this.$emit("onDataChanged", cloneData);
    // },
    onDataChanged(event, attr) {
      let cloneData = Utils.cloneObject(this.data);
      cloneData[attr] = event.target.value;
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
</style>