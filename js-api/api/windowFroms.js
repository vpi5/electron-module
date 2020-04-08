'use strict';
var {spawn} = require('child_process');
var BrowserWindow = top.require('electron').remote.BrowserWindow;
var fs = top.require('fs');
var app = top.require('electron').remote.app;
var path = top.require('path');
var ipcRenderer = top.require('electron').ipcRenderer;
var os = top.require('os');

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

//当前获取焦点窗口的最大化
function maxWindowSize() {
    var mWindow = BrowserWindow.getFocusedWindow();
    mWindow.maximize();
}

//窗口大小切换，模拟“口”
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

