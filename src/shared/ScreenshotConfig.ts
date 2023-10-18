import { DesignTemplate } from "./DesignTemplate";

export class ScreenshotConfig {
    public static fromJSON(jsonData: any) {
        return new ScreenshotConfig(jsonData.id, jsonData.name, jsonData.cards);
    }
    private id: string;
    private name: string;
    private cards: DesignTemplate[];

    constructor(id: string, name: string, cards: DesignTemplate[]) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    public getId() { return this.id }
}