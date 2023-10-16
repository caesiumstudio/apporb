import { CommandValue } from "@/shared/IPCListener";
import { IPCNative } from "../ipc/IpcNative";
import { StatusResponse } from "@/shared/StatusResponse";
import Jimp from "jimp";
import { FileSystem } from "@/shared/FSystem";
const ImageDataURI = require('image-data-uri');

const TAG = "AppsLoader";

export class ImageEditor {
    isValid(args: CommandValue): boolean {
        const commandList: string[] = [
            "CMD_EXPORT_SCREENSHOT"
        ];
        return commandList.indexOf(args.command) >= 0;
    }

    run(args: CommandValue): void {
        const fileSystem = new FileSystem();
        let fullPath = fileSystem.getUniqueName(args.value.fullPath);
        let imageData = args.value.imageData;
        let size = args.value.size;

        ImageDataURI.outputFile(imageData, fullPath).then((imagePath: string) => {
            console.log(imagePath);

            Jimp.read(imagePath, (err, image) => {
                if (err) {
                    console.log(err);
                    const status: StatusResponse = { code: -1, message: "Error" };
                    args.value = status;
                    IPCNative.instance().onNativeEvent(args);
                } else {
                    image.crop(0, 0, size.width, size.height)
                        // image.resize(256, 256) // resize
                        // .quality(60) // set JPEG quality
                        // .greyscale() // set greyscale
                        .write(fullPath); // save
                    const status: StatusResponse = { code: 0, message: "Exported successfully." };
                    args.value = status;
                    IPCNative.instance().onNativeEvent(args);
                }

            });

        })
    }
}


