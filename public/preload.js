const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld(
    'electron',
    {
        ipcSend: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        ipcReceive: (channel, observer) => {
            ipcRenderer.on(channel, observer);
        }
    }
);
