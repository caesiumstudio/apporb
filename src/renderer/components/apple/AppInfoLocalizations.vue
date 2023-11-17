<template>
    <div class="">

        <div v-if="Object.keys(app).length">
            <div class="ui">
                <AppInfoTopMenu :appInfoLocalizations="appInfoLocalizations"></AppInfoTopMenu>
            </div>
            <div v-show="appInfoLocalizations.length > 0" class="ui styled fluid accordion">
                <template v-for="(appInfo, index) in appInfoLocalizations" :key="index">
                    <div class="title">
                        <i class="dropdown icon"></i>
                        {{
                            getLanguage(getAttributes(appInfo).locale) +
                            " (" +
                            getAttributes(appInfo).locale +
                            ")"
                        }}
                    </div>
                    <div class="content">
                        <AppInfoLocalization :appInfos="appInfo"></AppInfoLocalization>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
  
<script>
import { Translation } from "@/shared/constants/Translation";
import AppInfoTopMenu from "./AppInfoTopMenu";

import { App, APPLE_DEV_HOST } from "@/shared/App";
import { Commands } from "@/shared/constants/Commands";
import IPCClient from "@/renderer/ipc/IPCClient";
import { ViewController } from "@/renderer/ViewController";
import { Toaster } from "@/renderer/services/Toaster";
import AppInfoLocalization from "./AppInfoLocalization.vue"

export default {
    components: {
        AppInfoLocalization,
        AppInfoTopMenu
    },

    data() {
        return {
            appInfoLocalizations: [],
        };
    },

    props: {
        app: Object,
    },

    watch: {
        app: {
            handler(newApp) {
                this.loadAppInfos(newApp);
            },
        },
    },

    methods: {
        loadAppInfos(app) {
            ViewController.setProgress(true);
            IPCClient.instance().request(
                {
                    command: Commands.CMD_HTTP_GET_APP_INFO,
                    value: this.getPath(app.relationships.appInfos.links.related),
                },
                (response) => {
                    ViewController.setProgress(false);
                    if (response.code < 0) {
                        Toaster.showToast(response.error, Toaster.ERROR, 3000);
                    } else {
                        // this.customerReviews = response.data.data;
                        this.loadAppInfoLocalizations(response.data.data);
                    }
                }
            );
        },

        loadAppInfoLocalizations(appInfos) {
            ViewController.setProgress(true);
            IPCClient.instance().request(
                {
                    command: Commands.CMD_HTTP_GET_APP_INFO_LOCALIZATIONS,
                    value: this.getPath(appInfos[0].relationships.appInfoLocalizations.links.related),
                },
                (response) => {
                    ViewController.setProgress(false);

                    if (response.code < 0) {
                        Toaster.showToast(response.error, Toaster.ERROR, 3000);
                    } else {
                        this.appInfoLocalizations = response.data.data;
                    }
                }
            );
        },

        getPath(url) {
            return url.replaceAll("https://", "").replaceAll(APPLE_DEV_HOST, "");
        },


        getLanguage(locale) {
            const translation = new Translation();
            return translation.getLanguage(locale);
        },
        getAttributes(jsonObject) {
            console.log(JSON.stringify(App.getAttributes(jsonObject)));
            return App.getAttributes(jsonObject) || {};
        },
    },

    mounted() {
        // window.$(".ui.accordion").accordion();
        // window.$(".menu .item").tab();
    },

    computed: {
        darkMode() {
            return this.$store.state.appConfig.darkMode;
        },
    },
};
</script>
  
<style scoped>
.container {
    height: 100vh;
    width: 100%;
    min-height: 100%;
    overflow: scroll;
    padding: 8px 8px 128px 8px;
}

#content {
    border: none;
}
</style>