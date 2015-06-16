module.exports = (function () {
	/*
	 * 全局配置 
	 * 
	 * 注：路径要有结尾的‘/’
	 */
    global.mods = {};
	return {
		//根目录
		"root_dir": __dirname,
		//静态文件目录
		"static_dir": __dirname + "/statics/",

		//日志文件路径
		"log": __dirname + "/db/log/",

		//模版输出路径
		//【用于保存输出的模版】
		"template": __dirname + "/bin/template/",

		//渲染器路径
		//【这里存放渲染器的】
		"vary": __dirname + "/vary/",

		//视图路径
		//【html代码文件地址】
		"views": __dirname + "/views/",

		//控制器路径
		//【后台文件地址】
		"controller": __dirname + "/controller/",

		//路由器路径
		//【路由，不解释】
		"route": __dirname + "/route/",

		//默认首页控制器
		//【网站首页】
		"index": "index",

		//视图布局控制器
		//【模版控制器不渲染】
		"views_layout": "layout",

		//favicon.ico文件
		"favicon": __dirname + "/favicon.ico"
	}
})()