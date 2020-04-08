'use strict';
var BrowserWindow = top.require('electron').remote.BrowserWindow;
var app = top.require('electron').remote.app;
const { clipboard } = require('electron');
const path = require("path");
const child = require('child_process');

/* ---- 截图 ---- */

function openScreenShot() {

    if (isWindows()) {
        child.execFile(
            path.join(__dirname, "../js-api", "screen", "dll", "百度截图.exe"),
            function (err, data) {
                //完成截图
                if (err == null) {
                    finishShot(1);
                }
            }
        );
    }
    else { //MacOS
        var screenShotExePath = path.join(__dirname, "../js-api", "screen", "mac", "ScreenCapture.app/Contents/MacOS/ScreenCapture");
        var screenShotPatharam = ['startfromlocal,' + path.join(__dirname, 'set.info ') + ',' + path.join(__dirname, 'response.info') + ',0,3,0,0,0,0,0'];
        child.spawn(screenShotExePath, screenShotPatharam, { stdio: 'inherit' }).on('close', function (code) {
            finishShot(code);
        })

    }

}

function finishShot(code) {
    if (code == 1) {
        let nativeImage = clipboard.readImage('selection');
        //粘贴图片
        if (nativeImage.getSize().width > 0) {
            var image = clipboard.readImage();
            // 生成 base64 流
            let nativeImageSrc = image.toDataURL();
            console.log(nativeImageSrc);
            // 清空 剪切板
            clipboard.clear();
        }
    }
    else if (code == 2) {//取消截图
    }
    else if (code == 3) {//保存截图
    }
}
function isWindows() {
    var os = require("os");
    return os.platform() == "win32";
}



/* ---- 窗体开始 ---- */
// 新开窗口
function createIframeWindow (param, callback){
    let newwin = new BrowserWindow({
        width: 800,
        height: 600,
        parent: BrowserWindow.getFocusedWindow(), //win是主窗口
        autoHideMenuBar: true,
        useContentSize: true,
        show:false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    newwin.webContents.on('did-finish-load' , () =>{
        newwin.show() ;
    }) ;

    newwin.loadURL(param.url); //new.html是新开窗口的渲染进程
    newwin.on('closed',()=>{newwin = null})
}

//返回当前所处的系统
function getPlatform() {
    return process.platform;
}

//关闭窗口
function closeWin() {
    //获取当前获得焦点的窗口
    var mainWin = BrowserWindow.getFocusedWindow();
    if (mainWin == null) {
        console.log("当前没有获取焦点的窗口")
    } else {
        var winArr = BrowserWindow.getAllWindows();
        if (winArr.length == 1) {
            app.quit();
        } else {
            mainWin.close();
        }
    }
}

//窗口最大化
function maxWindowSize() {
    var mWindow = BrowserWindow.getFocusedWindow();
    mWindow.maximize();
}

//窗口大小切换  toggle
function windowSizeSwitch() {
    var mainWin = BrowserWindow.getFocusedWindow();
    if (mainWin && !mainWin.isDestroyed()){
        if(mainWin.isMaximized()){
            mainWin.unmaximize();
            event.preventDefault();
        }else{
            mainWin.maximize();
            event.preventDefault();
        }
    }
}

//窗口最小化
function winMinAndRestore() {
    var mainWin = BrowserWindow.getFocusedWindow();
    //判断窗口是否最小化
    if (mainWin.isMinimized()) {
        //窗口最小化，设置恢复原状
        mainWin.restore();
    } else {
        mainWin.minimize();
    }
}

/* ---- 窗体结束 ---- */
