import { Utils } from "@/native/utils/Utils";

export interface NotifHistory {
    id: string,
    timestamp: string,
    status: string
    title: string,
    messageId: string
}

export interface Notification {
    id: string,
    title: string,
    topic: string,
    authKey: string,
    notifJson: string,
    dataJson: string,
    history: NotifHistory[]
}

export const emptyNotification = {
    id: Utils.getUID(),
    title: "Test Notification Title",
    topic: "test-topic",
    authKey: "test-authkey",
    notifJson: '{"title": "test-title", "body": "test-body", "color": "#bcbf01"}',
    dataJson: '{"title": "title", "message": "message", "url": "https://www.google.com"}',
    history: []
};