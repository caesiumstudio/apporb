export class DesignTemplate {

    private data: object;

    constructor(args: any, index: number) {
        this.data = {
            name: args.name + "-" + index,
            text: "Heading text goes here",
            appImage: "assets/placeholders/iphone12/screenshot.png",
            bezel: "assets/placeholders/iphone12/iphone12.png",
            style: args.style,
            textStyles: args.textStyles || 'color: #ffffff;',
        }
    }

    public getData() {
        return this.data;
    }

}