<template>
  <div class="screenshot" @click="onCardClicked" :id="config.name" :style="config.style">
    <div class="headerTextContainer">
      <div class="headerText" :style="config.textStyles">
        <div v-html="config.text"></div>
      </div>
    </div>
    <div class="imgContainer">
      <img class="bezel" :src="config.bezel" />
      <div class="appWrapper">
        <div class="appImageFrame">
          <img class="appImage" :src="config.appImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
  },

  data() {
    return {
      widthPx: this.config.size.width + "px",
      heightPx: this.config.size.height + "px",
    };
  },
  watch: {
    config: {
      deep: true,
      handler(newConfig) {
        this.widthPx = this.config.size.width + "px";
        this.heightPx = this.config.size.height + "px";
      },
    },
  },

  mounted() {
    console.log("prop: " + JSON.stringify(this.config.size));
  },
  methods: {
    onCardClicked() {
      this.$emit("onCardClicked", this.config);
    },
  },
};
</script>

<style scoped>
.screenshot {
  overflow: hidden;
  width: v-bind("widthPx");
  height: v-bind("heightPx");
  transform: scale(0.2);
  transform-origin: 0 0;
}

.headerTextContainer {
  width: 100%;
}

.headerText {
  font-size: 90px;
  padding: 60px 0px;
  line-height: 1.2;
  text-align: center;
}

.imgContainer {
  position: relative;
  display: flex;
  width: 90%;
  margin-left: calc(100% - 95%);
  flex-direction: column;
  justify-content: center;
}

.imgContainer .bezel {
  position: absolute;
  width: 100%;
  z-index: 100;
}

.appWrapper {
  padding: 82px;
}

.imgContainer .appImageFrame {
  border-radius: 100px;
  overflow: hidden;
  z-index: 50;
}

.imgContainer .appImageFrame img {
  width: 100%;
}
</style>