
import { Utils } from '@/shared/Utils';

declare const window: any;
export class Toaster {
    public static ERROR = 'error';
    public static WARNING = 'orange';
    public static INFO = 'blue';
    public static SUCCESS = 'green';

    public static showToast(message: string, type: string, timeInMilliSeconds: number) {
        (window.$('body') as any).toast({
            position: 'top right',
            message: message,
            displayTime: timeInMilliSeconds,
            showProgress: 'top',
            classProgress: type,
            progressUp: false
        });
    }

    public static showReportIssueDialog(message: string): void {
        (window.$('body') as any).toast({
            message: message,
            displayTime: 0,
            class: 'white',
            classActions: 'right vertical attached',
            actions: [{
                text: 'Got it',
                class: 'white',
                click: function () {
                    console.log("clicked");
                }
            }, {
                text: "Report",
                class: 'grey',
                click: function () {
                    Utils.openLinkExternal('https://github.com/caesiumstudio/csBooks-updates/issues');
                }
            }]
        });
    }
}
