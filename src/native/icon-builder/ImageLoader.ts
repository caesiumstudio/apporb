import { CommandValue } from "@/shared/IPCListener";
import { IPCNative } from "../ipc/IpcNative";
import { StatusResponse } from "@/shared/StatusResponse";
import Jimp from "jimp";
import { Log } from "@/shared/Logger";
import path, { join } from 'path'
import { readdir } from "fs/promises";

const ImageDataURI = require('image-data-uri');

const TAG = "AppsLoader";

export class ImageLoader {
    isValid(args: CommandValue): boolean {
        const commandList: string[] = [
            "CMD_EXPORT_APP_ICON",
            "CMD_GET_APP_ICON"
        ];
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        if (args.command === "CMD_EXPORT_APP_ICON") {
            this.generateIcons(args);
        } else if (args.command === "CMD_GET_APP_ICON") {
            this.sendIconData(args);
        }
    }

    generateIcons(args: CommandValue) {
        const iconPath = args.value.iconPath;
        this.getFiles(args.value.exportPath).then((fileArray: string[][]) => {
            return this.filterImages(fileArray);
        }).then((fileArray: string[]) => {

            const totalFiles = fileArray.length;
            const promises: Promise<boolean>[] = [];
            for (let i = 0; i < fileArray.length; i++) {
                const imageFilePath = fileArray[i];
                promises.push(this.resizeImage(iconPath, imageFilePath));
            }
            Promise.all(promises).then((values) => {
                this.sendIconData(args);
            });
        });
    }

    resizeImage(iconPath: string, imagePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            Jimp.read(imagePath, (err, image) => {

                const width = image.getWidth();
                const height = image.getHeight();
                Jimp.read(iconPath, (error, icon) => {
                    if (error) {
                        Log.debug(TAG, "Error: " + error);
                        return;
                    }
                    icon.resize(width, height).write(imagePath);
                    console.log(path.basename(imagePath) + ` ${width} x ${height}`);
                    resolve(true);
                });
            });

        });
    }

    sendIconData(args: CommandValue) {
        this.getFiles(args.value.exportPath).then((files: any) => {
            const status: StatusResponse = { code: 0, message: "Success", data: this.filterImages(files) };
            args.value = status;
            IPCNative.instance().onNativeEvent(args);
        });
    }

    async getFiles(dirPath: string) {
        return Promise.all(
            await readdir(dirPath, { withFileTypes: true }).then((entries: any) => entries.map((entry: any) => {
                const childPath = join(dirPath, entry.name)
                return entry.isDirectory() ? this.getFiles(childPath) : childPath;
            })),
        );
    }

    filterImages(files: any) {
        files = files.flat(Number.POSITIVE_INFINITY);
        const images: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);

            if (!file.endsWith('png') && !file.endsWith('jpg')) {
                files.splice(i, 1);
                i--;
                continue;
            }

            if (file.indexOf("mipmap") > 0) {
                images.push(file);
            }
        }

        return images;
    }
}


