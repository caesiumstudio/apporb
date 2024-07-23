
const admin = require('firebase-admin');


export class FCMNotif {
    public initApp(serviceAccountPathOfJSONFile: string) {
        const serviceAccount = require(serviceAccountPathOfJSONFile);
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    sendToTopic(topic:string, notification:any, data:any) {
        const message = {
            // token: token,
            notification: notification,
            data: data
        };

        admin.messaging().sendToTopic(topic, message)
            .then((response:any) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error:any) => {
                console.log('Error sending message:', error);
            });
    }

    public sendToToken(token:string, notification:any, data:any) {
        const message = {
            token: token,
            notification: notification,
            data: data
        };

        admin.messaging().send(message)
            .then((response:any) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error:any) => {
                console.log('Error sending message:', error);
            });

    }
};
