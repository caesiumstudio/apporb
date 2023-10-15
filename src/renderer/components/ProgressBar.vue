<template>
  <div :class="['top-progressbar', isProgressOn ? 'bg' : '']">
    <div v-show="isProgressOn"></div>
  </div>
</template>
<script>
export default {
  computed: {
    isProgressOn() {
      const isProgressOn = this.$store.state.appConfig.isProgressOn;
      console.log("progress on :" + isProgressOn);
      return isProgressOn;
    },
  },
};
</script>
<style scoped>
.top-progressbar {
  width: 100%;
  position: absolute;
}

.top-progressbar.bg {
  background-size: 300% 300%;
  height: 4px;
  background-image: linear-gradient(
    -90deg,
    rgb(0, 255, 106) 0%,
    rgb(225, 0, 255) 50%,
    rgb(0, 204, 255) 100%
  );
  /* -webkit-animation: AnimateBG 10s ease infinite; */
  animation: AnimateBG 0.5s ease infinite;
}

@-webkit-keyframes AnimateBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes AnimateBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
