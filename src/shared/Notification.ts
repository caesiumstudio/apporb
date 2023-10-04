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
    dataJsno: string, 
    history: NotifHistory[]
}