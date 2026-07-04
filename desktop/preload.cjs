const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("FieldOpsDesktop", {
  getSource: () => ipcRenderer.invoke("fieldops:source"),
  useLiveSource: () => ipcRenderer.invoke("fieldops:set-source", "live"),
  useLocalSource: () => ipcRenderer.invoke("fieldops:set-source", "local")
});
