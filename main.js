// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./readItem");
const appMenu = require("./menu");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// 새로운 item 요청
ipcMain.on("new-item", (e, itemUrl) => {
  readItem(
    itemUrl,
    (item) => {
      // 새로운 item 받고 난 후 다시 renderer에 보내는 함수
      e.sender.send("new-item-success", item);
    },
    2000
  );
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // 윈도우 상태 객체
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650,
  });

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("renderer/main.html");

  // 윈도우 상태 저장
  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
