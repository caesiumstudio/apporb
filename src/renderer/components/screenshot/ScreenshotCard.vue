<template>
  <div class="screenshot">
    <div class="headerTextContainer">
      <div class="headerText">Learn anything anywhere</div>
    </div>
    <div class="imgContainer">
      <img
        class="bezel"
        src="file:///home/ravi/Downloads/Bezel-iPhone-12/PNG/iPhone12.png"
      />
      <div class="appWrapper">
        <div class="appImageFrame">
          <img
            class="appImage"
            src="file:///home/ravi/Documents/Dropbox/Flitm/App Store Marketing/flitmscreenshots/IMG-3177.PNG"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screenshot {
  overflow: hidden;
  margin-top: 8px;
  /* height: 736px;
  width: 414px; */

  height: 2208px;
  width: 1242px;
  transform: scale(0.3);
  transform-origin: 0 0;
  background-image: linear-gradient(
    180deg,
    #248d88 0%,
    #7811a1 35%,
    #00d4ff 100%
  );
  background-color: pink;
}

.headerTextContainer {
  width: 100%;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.headerText {
  color: white;
  font-size: 90px;
  padding: 80px 0px;
  line-height: 1;
}

.imgContainer {
  position: relative;
  display: flex;
  width: 90%;
  /* height: 90%; */
  margin-left: calc(100% - 95%);
  flex-direction: column;
  justify-content: center;
  /* background-color: rgb(255, 0, 0); */
  top: 20px;
}

.imgContainer .bezel {
  position: absolute;
  width: 100%;
  /* height: 100%; */
  z-index: 100;
}
.appWrapper {
  padding: 82px;
}
.imgContainer .appImageFrame {
  border-radius: 100px;
  overflow: hidden;
  /* padding: 16px; */
  /* border: 1px solid red; */
  /* width: 100%; */
  /* height: 100%; */
  z-index: 50;
}

.imgContainer .appImageFrame img {
  /* padding: 16px; */
  width: 100%;
  /* height: 100%; */
  /* height: 100%; */
  /* z-index: 50; */
}
</style>