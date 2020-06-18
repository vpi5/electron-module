let express = require('express');

let getport = require('getport');

let app = express();

let rooter = express.Router();

// TODO 解决 api 跨域 并 解决 headers 中放置 token 参数
app.all('*', function(req, res, next) {
    //设为指定的域
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Access-Control-Allow-Headers", "token");
    // 收到遇见请求返回成功状态
    if(req.method == 'OPTIONS'){
        res.send(200)
    }else{
        next();
    }
});

rooter.get('/test', (req, res, next) => {

    res.json({
        code : 'Y',
        data : [
            {name : '张三', age : 18}
        ]
    })

});

app.use('/test', rooter);


// TODO 服务端 404 服务接口 捕获异常
app.use((req, res, next) => {

    res.json({
        code : 'N',
        message : '服务端api接口不存在！',
    })

});

// TODO 全局错误处理
app.use((err, req, res) => {

    if(err) {
        res.status(500).json({
            code : 'N',
            message : `异常捕获：${err.message || '服务端异常'}`
        })
    }

});

// TODO 启动服务
function startServer () {
    return new Promise(callback => {
        getport(function (e, p) {
            if (e) throw e;
            app.listen(p, () => {
                console.log('server : ', p);
                callback(p);
            });
        });
    })

}
module.exports = startServer;

