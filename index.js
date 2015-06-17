/*
 * 入口
 */
//配置
require('./setting.js');

var 
	express = require('express'),
    http = require('http'),
    app = express(),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    zoe = require('zoe')();

//静态文件夹
app.use(express.static(global.settings.static_dir));

//网站图标
app.use(favicon(global.settings.favicon));

//路由器
app = require(global.settings.route)(app);

//服务器
var httpServer = http.createServer(app);

//启动监听
httpServer.listen(3000, function () {
    zoe.log('【server run】Listening on port:'+ httpServer.address().port);
});
