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
          "synopsis": "App marketing made simple",

          "target": [
            "AppImage",
            "deb",
            "snap",
            "pacman", // for building pacman package execute first "sudo apt install libarchive-tools"
            "rpm" // for building rpm package execute first "sudo apt-get install rpm"
          ]
        },
        "snap": {
          "plugs": ["default", "removable-media"]
        },
        "win": {
          "target": "appx",
          "target": "nsis"
        },
        "appx": {
          "identityName": "46191CaesiumStudio.csBooks",
          "publisher": "CN=A963860E-2E38-4B48-8DBB-6D90B3BAE06D",
          "publisherDisplayName": "Caesium Studio",
          "applicationId": "com.caesiumstudio.csbooks"
        }
      }
    }
  }
});
