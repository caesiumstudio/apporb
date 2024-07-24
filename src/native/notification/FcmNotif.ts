
const admin = require('firebase-admin');
import fs from 'fs';

export class FCMNotif {
    private apps: { [key: string]: string } = {};
    public initApp(serviceAccountPathOfJSONFile: string) {
        // const serviceAccount = require(serviceAccountPathOfJSONFile);
        const fileContent = fs.readFileSync(serviceAccountPathOfJSONFile);

        const serviceAccount = JSON.parse(fileContent.toString());
        console.log('appId: ' + serviceAccount.project_id);
        if (!this.apps[serviceAccount.project_id]) {
            console.log('initializing app');
            this.apps[serviceAccount.project_id] = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                name: serviceAccount.project_id
            });
        } else {
            console.log('app already initialized');
        }
    }

    public async sendToTopic(topic: string, notification: any, data: any) {
        const message = {
            // token: token,
            notification: notification,
            data: data
        };

        return new Promise((resolve: any, reject: any) => {
            admin.messaging().sendToTopic(topic, message)
                .then((response: any) => {
                    resolve(response);

                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }

    public async sendToToken(token: string, notification: any, data: any)  {
        const message = {
            token: token,
            notification: notification,
            data: data
        };

        return new Promise((resolve: any, reject: any) => {
            admin.messaging().send(message)
                .then((response: any) => {
                    resolve(response);
                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }
};
