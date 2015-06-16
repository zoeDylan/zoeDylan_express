/*
 * ���
 */
//����
global.settings = require('./setting.js');



var 
	express = require('express'),
    http = require('http'),
    app = express(),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    zoe = require('zoe')({
        log: {
            "appenders": [     
                { "type": "dateFile", "filename": global.settings.log + 'def_', "pattern": "yyyyMMddhhmm.txt", "alwaysIncludePattern": true, "category": "default", "maxLogSize": 20480, }
            ],
            "levels": { "logInfo": "DEBUG" }
        }
    });

zoe.log('11111');

app.use(express.static(global.settings.static_dir));

//��վͼ��
app.use(favicon(global.settings.favicon));

//·����
app = require(global.settings.route)(app);

//������
var httpServer = http.createServer(app);
httpServer.listen(3000, function () {
    console.log('Listening on port %d', httpServer.address().port);
});
