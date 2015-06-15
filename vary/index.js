/*
 * 渲染器
 */
var path = require('path'),
	fs = require('fs'),
	dot = require('dot');
 
dot.templateSettings = {
	evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode: /\{\{!([\s\S]+?)\}\}/g,
	use: /\{\{#([\s\S]+?)\}\}/g,
	useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	defineParams: /^\s*([\w$]+):([\s\S]+)/,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname: "it",
	strip: true,
	append: true,
	selfcontained: false,
	doNotSkipEncoded: false
};

//文件复制
function fileCopy(come, to) {

	/*
	 * 复制目录中的所有文件包括子目录
	 * @param{ String } 需要复制的目录
	 * @param{ String } 复制到指定的目录
	 */
	var copy = function (src, dst) {
		// 读取目录中的所有文件/目录
		fs.readdir(src, function (err, paths) {
			if (err) {
				throw err;
			}
			paths.forEach(function (path) {
				var _src = src + '/' + path,
					_dst = dst + '/' + path,
					readable, writable;
				fs.stat(_src, function (err, st) {
					if (err) {
						throw err;
					}
					// 判断是否为文件
					if (st.isFile()) {
						// 创建读取流
						readable = fs.createReadStream(_src);
						// 创建写入流
						writable = fs.createWriteStream(_dst);
						// 通过管道来传输流
						readable.pipe(writable);
					}
						// 如果是目录则递归调用自身
					else if (st.isDirectory()) {
						exists(_src, _dst, copy);
					}
				});
			});
		});
	};

	// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
	var exists = function (src, dst, callback) {
		//检查文件夹
		if (!fs.existsSync(dst)) {
			fs.mkdirSync(dst);
		}
		callback(src, dst);
	};

	// 复制目录
	exists(come, to, copy);
}

//路径、控制器名称、方法名称
function req(path, control, name) {
	var module = require(path);
	delete exports[control][name];
	return exports[control][name] = module;
}

//渲染
function vary(file) {
	var
		//模版文件夹
		dir_template = global.settings.template + file,

		//页面文件
		viewsDirCome = global.settings.views + file,

		//视图布局文件夹
		layoutDirCome = global.settings.views + global.settings.views_layout,

		//临时文件夹渲染
		tempDir = global.settings.template + global.settings.views_layout;

	//检查文件夹
	if (!fs.existsSync(dir_template)) {
		fs.mkdirSync(dir_template);
	}

	//路径、编译
	var files = dot.process({
		destination: dir_template,
		path: viewsDirCome
	});

	//console.log(dot.compile(viewsDirCome + '\index.html', {loadfile: function (path) {path = global.settings.views + data.control + '/' + path;return fs.readFileSync(path);}})); 

	/*模版处理*/
	fs.readdirSync(dir_template).forEach(function (file) {

		var ext = path.extname(file);

		var stats = fs.statSync(dir_template + file);

		if (stats.isFile() && !(ext in require.extensions)) { return; }

		var name = path.basename(file, '.js'),
			control = path.basename(dir_template),
			cPath = dir_template + name;

		if (!exports[control]) {
			exports[control] = {};
		}

		exports[control].__defineGetter__(name, function () {
			return req(cPath, control, name);
		});
	});
}

/*渲染处理*/
fs.readdirSync(global.settings.views).forEach(function (file) {
	var
		nowPath = global.settings.views + file;

	if (fs.statSync(nowPath).isDirectory() && file != global.settings.views_layout) {
		//vary(file + '/');
	}
});

