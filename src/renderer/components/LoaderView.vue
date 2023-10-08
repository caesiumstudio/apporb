<template>
  <div class="loader-container">
    <div v-if="config.isIconVisible" class="ui active dimmer loading-icon">
      <div class="ui indeterminate text blue loader loading-icon-text">
        {{ config.text }}
      </div>
    </div>
    <div v-else class="ui active dimmer loading-icon">
      <h4 class="ui secondary header">{{config.text}}</h4>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoaderView',
  props: {
    config: Object
  }
};
</script>
<style scoped>
.loader-container {
  position: absolute;
  top: 50%;
  left: calc(50% - 200px);
  width: 600px;
}
.loading-icon {
  position: relative;
  background: none;
}
.loading-icon-text {
  color: #202020 !important;
}
</style>