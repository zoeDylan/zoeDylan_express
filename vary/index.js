/*
 * ��Ⱦ��
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

//�ļ�����
function fileCopy(come, to) {

	/*
	 * ����Ŀ¼�е������ļ�������Ŀ¼
	 * @param{ String } ��Ҫ���Ƶ�Ŀ¼
	 * @param{ String } ���Ƶ�ָ����Ŀ¼
	 */
	var copy = function (src, dst) {
		// ��ȡĿ¼�е������ļ�/Ŀ¼
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
					// �ж��Ƿ�Ϊ�ļ�
					if (st.isFile()) {
						// ������ȡ��
						readable = fs.createReadStream(_src);
						// ����д����
						writable = fs.createWriteStream(_dst);
						// ͨ���ܵ���������
						readable.pipe(writable);
					}
						// �����Ŀ¼��ݹ��������
					else if (st.isDirectory()) {
						exists(_src, _dst, copy);
					}
				});
			});
		});
	};

	// �ڸ���Ŀ¼ǰ��Ҫ�жϸ�Ŀ¼�Ƿ���ڣ���������Ҫ�ȴ���Ŀ¼
	var exists = function (src, dst, callback) {
		//����ļ���
		if (!fs.existsSync(dst)) {
			fs.mkdirSync(dst);
		}
		callback(src, dst);
	};

	// ����Ŀ¼
	exists(come, to, copy);
}

//·�������������ơ���������
function req(path, control, name) {
	var module = require(path);
	delete exports[control][name];
	return exports[control][name] = module;
}

//��Ⱦ
function vary(file) {
	var
		//ģ���ļ���
		dir_template = global.settings.template + file,

		//ҳ���ļ�
		viewsDirCome = global.settings.views + file,

		//��ͼ�����ļ���
		layoutDirCome = global.settings.views + global.settings.views_layout,

		//��ʱ�ļ�����Ⱦ
		tempDir = global.settings.template + global.settings.views_layout;

	//����ļ���
	if (!fs.existsSync(dir_template)) {
		fs.mkdirSync(dir_template);
	}

	//·��������
	var files = dot.process({
		destination: dir_template,
		path: viewsDirCome
	});

	//console.log(dot.compile(viewsDirCome + '\index.html', {loadfile: function (path) {path = global.settings.views + data.control + '/' + path;return fs.readFileSync(path);}})); 

	/*ģ�洦��*/
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

/*��Ⱦ����*/
fs.readdirSync(global.settings.views).forEach(function (file) {
	var
		nowPath = global.settings.views + file;

	if (fs.statSync(nowPath).isDirectory() && file != global.settings.views_layout) {
		//vary(file + '/');
	}
});

