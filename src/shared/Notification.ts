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