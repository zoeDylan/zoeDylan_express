/*
 * 入口
 */
var
	express = require('express'),
	http = require('http'),
	app = express(),
	favicon = require('serve-favicon'),
	fs = require('fs');

//配置
global.settings = require('./setting.js');

app.use(express.static(global.settings.static_dir));

//网站图标
app.use(favicon(global.settings.favicon));

//路由器
app = require(global.settings.route)(app);

//服务器
var httpServer = http.createServer(app);
httpServer.listen(3000, function () {
	console.log('Listening on port %d', httpServer.address().port);
});
