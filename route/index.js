﻿/*
 * 路由
 */
module.exports = function (app) {
    var 
		render = require(global.settings.vary),
        fs = require('fs'),
        cons = require('consolidate'),
        def = require('./def.js'),
        zoe = require('zoe')(),
        log = zoe.log;
    
    //控制器处理
    function getController(req, res) {
        /*请求路径 控制器名称 处理器名称 整体路径 返回数据*/
        var 
			path = req.path,
            control = path.split('/')[1] || global.settings.index,
            method = path.split('/')[2] || global.settings.index,
            allPath = global.settings.controller + control + '/' + method,
            data = {
                value: {},
                req: req,
                res: res
            };
        
        if (fs.existsSync(allPath + '.js')) {
            data = require(allPath)(req, res);
        } else {
            log('no controller::' + allPath);
        }
        return {
            value: data.value,
            control: control,
            method: method,
            req: data.req,
            res: data.res,
            type: data.type || 'html'
        };
    }    ;
    
    app.get(/.+/, function (req, res) {
        var 
			data = getController(req, res),
            atPath = global.settings.views + data.control + '/' + data.method;
        req = data.req;
        res = data.res;
        //404报错处理
        function err_404(error) {
            error = error || '嘿,Man And Woman,你们走错地方了!'
            
            cons.dot(global.settings.views + 'index/error_404.html', {
                error: error
            }, function (err, html) {
                res.send(html);
            });
        }
        
        //日志记录
        log('{ "ip":"' + req.ip + '","url":"' + req.url + '", "end":"' + data.type + '"}');
        if (data.type == 'html') {
            log(req.path + '>>html');
            data.value._def = def({
                control: data.control
            });
            cons.dot(atPath + '.html', data.value, function (err, html) {
                if (!err) {
                    res.send(html);
                } else {
                    err_404();
                }
            });
        } else if (data.type.search(/json/) == 0) {
            log(req.path + '>>json');
            res.send(data.value);
        } else if (data.type.search(/file/) == 0) {
            log(req.path + '>>file');
            res.sendFile(data.value);
        } else if (data.type.search(/text/) == 0) {
            log(req.path + '>>text');
            res.send(data.value);
        } else if (data.type.search(/error/) == 0) {
            log('type:error');
            err_404(data.value);
        } else {
            err_404();
        }
    });
    
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('error_500');
    });
    
    return app;
};