
function injectJS() {
    var resultArr = [];
    var xinyusoftJS = injectJSWithURL('../js-api/api/electron-js-api.js');
    resultArr.push(xinyusoftJS);
    return resultArr;
}

function injectJSWithURL(url) {
    return "var script = document.createElement('script');" + "script.type = 'text/javascript';" + "script.src = '" + url + "';" + "document.getElementsByTagName('head')[0].appendChild(script);";
}

module.exports.injectJSWithURL = injectJSWithURL;
module.exports.injectJS = injectJS;
