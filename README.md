#zoeDylan_express

>#####做这个项目初衷是用来学习nodejs的,内容有很多不合理的地方希望大家提出意见或建议.


>项目使用了**express.js**框架和**dot.js**渲染器,因为我之前是做.net的,习惯用.net的MVC,所以做这个项目的时候很多地方是模仿了.net MVC的.

>**/index.js**文件是启动文件,文件内部基本上不需要更改.

>**/setting.js**文件是配置文件,里面的路径可以修改.配置文件的路径暂时还没有做自动创建

>**zoe模块**

    var zoe=require('zoe')();
    var log=zoe.log;//可以直接**zoe.log**调用

>>**log函数**：：这个是日志模块

>>    log('消息内容');

>>    log.info('消息内容');  //等价于:log('消息内容');

>>    log.debug('消息内容');

>>    log.warn('消息内容');

>>    log.error('消息内容');

>>    log.fatal('消息内容');

>&copy; zoeDylan