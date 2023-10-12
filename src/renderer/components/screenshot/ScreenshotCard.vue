<template>
    <div class="container">
        <div class="screenshot">
            <div class="headerTextContainer">
                <div class="headerText">Learn anything anywhere</div>
            </div>
            <div class="imgContainer">
                <img class="bezel" src="file://C:\Users\D059976\Downloads\Bezel-iPhone-12\PNG\iPhone12-White-Portrait.png" />
                <img class="app" src="file://C:\Users\D059976\Downloads/harm/1.png" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.screenshot {
    overflow: hidden;
    margin-top: 8px;
    height: 736px;
    width: 414px;
    background-color: rgb(248, 128, 248);
}

.headerTextContainer {
    width: 100%;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    flex-direction: row;
}

.headerText {
    color: white;
    font-size: 30px;
    padding: 20px;
    line-height: 1;
}

.imgContainer {
    position: relative;
    border: 1px solid black;    
}

.imgContainer .bezel {
    position: absolute;
    padding: 40px;
    width: 100%;
    z-index: 100;
}
.imgContainer .app {
    position: absolute;
    padding: 64px;
    width: 100%;
    z-index: 10;
}
</style>