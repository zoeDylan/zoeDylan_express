/*
 * ���
 */
//����
require('./setting.js');

var 
	express = require('express'),
    http = require('http'),
    app = express(),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    zoe = require('zoe')();

//��̬�ļ���
app.use(express.static(global.settings.static_dir));

//��վͼ��
app.use(favicon(global.settings.favicon));

//·����
app = require(global.settings.route)(app);

//������
var httpServer = http.createServer(app);

//��������
httpServer.listen(3000, function () {
    zoe.log('��server run��Listening on port:'+ httpServer.address().port);
});
