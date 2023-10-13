<template>
    <div class="screenshot">
        <div class="headerTextContainer">
            <div class="headerText">Learn anything anywhere</div>
        </div>
        <div class="imgContainer">
            <img class="bezel" src="file:///C:\Users\D059976\Downloads\Bezel-iPhone-12\PNG\iPhone12-White-Portrait.png" />
            <div class="appWrapper">
                <div class="appImageFrame">
                    <img class="appImage" src="file:///C:\Users\D059976\Downloads\harm\1.PNG" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.screenshot {
    box-shadow: 0 0 red;
    overflow: hidden;
    margin-top: 8px;
    height: 2208px;
    width: 1242px;
    transform: scale(0.2);
    transform-origin: 0 0;
    background-image: linear-gradient(180deg,
            #248d88 0%,
            #7811a1 35%,
            #00d4ff 100%);
    background-color: pink;
}

.headerTextContainer {
    width: 100%;
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
    top: 20px;
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