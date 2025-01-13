const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "com.caesiumstudio.apporb",
        "linux": {
          "category": "App Development",
          "synopsis": "Grow your app",
          "target": [
            "AppImage",
            "deb",
            "snap",
            "pacman", // for building pacman package execute first "sudo apt install libarchive-tools"
            "rpm" // for building rpm package execute first "sudo apt-get install rpm"
          ]
        },
        "win": {
          // "target": "appx",
          "target": "nsis"
        }
      }
    }
  }
});
