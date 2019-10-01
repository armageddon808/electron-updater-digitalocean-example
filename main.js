const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

log.info("App starting...");

let win;

function sendStatusToWindow(data) {
  log.info(data);
  win.webContents.send("message", data);
}

function createDefaultWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow({
    event: "checking-for-update"
  });
});

autoUpdater.on("update-available", info => {
  sendStatusToWindow({
    event: "update-available"
  });
});

autoUpdater.on("update-not-available", info => {
  sendStatusToWindow({
    event: "update-not-available"
  });
});

autoUpdater.on("error", err => {
  sendStatusToWindow({
    event: "error",
    error: err
  });
});

autoUpdater.on("download-progress", progressObj => {
  sendStatusToWindow({
    event: "download-progress",
    progress: progressObj
  });
});

autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow({
    event: "update-downloaded"
  });
});

app.on("ready", function() {
  createDefaultWindow();
  sendStatusToWindow("App is ready.");
  setTimeout(() => {
    sendStatusToWindow({
      event: "test-event"
    });
  }, 3000)
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  app.quit();
});
