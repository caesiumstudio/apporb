<template>
  <div class="notif-container">
    <div class="ui header">Preview</div>
    <div class="ui divider"></div>
    <div ref="previewImage"><img :src="previewImage.img" /></div>
  </div>
</template>
<script>
export default {
  props: {
    previewImage: Object,
  },
  data() {
    return {
      imgDataSrc: "",
    };
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
.notif-container {
  height: 100vh;
  width: 100%;
  min-height: 100%;
  overflow: scroll;
  padding: 8px 8px 128px 8px;
}
</style>