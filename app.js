const { app, BrowserWindow } = require('electron');
const Menu = require('electron').Menu;

let myHelper = require('./js-api/helper');

function createWindow () {
    // 去除窗体菜单
    Menu.setApplicationMenu(null);

    // 创建浏览器窗口
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            frame : false,
            nodeIntegration: true
        },
        show:false,
    });
    win.maximize();

    // js api 方法 注入
    win.webContents.on('did-finish-load', async () => {
        win.show() ;
        let webContents = win.webContents;
        let jsArr = myHelper.injectJS();
        for (let i = 0; i < jsArr.length; i++) {
            let jsString = jsArr[i];
            webContents.executeJavaScript(jsString);
        }
        let startServer = require('./server');
        win.webContents.send('ipc-Message', await startServer())
    });

    // 并且为你的应用加载index.html
    win.loadFile(__dirname + '/www/index.html');

    // 打开开发者工具
    win.webContents.openDevTools();
}

// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
