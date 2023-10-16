export interface ScreenshotConfig {
    id: string,
    name: string,
    designTemplate: [{
        id: string,
        text: string,
        style: string,
        textStyles: string,
        appImage: string,
        bezel: string
    }]

}