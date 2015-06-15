/*
 * 页面事件文件
 * 
 * 文件内容事件编写后可以在网页上调用
 * 示例：{{#def.**()}}
 *  
 */
module.exports = function (data) { 
	var
		def = {},
		fs = require('fs');

	//加载外部文件
	def.loadfile = function (path) {
		if (path.search(/\~\/|\//) == 0) {
			path = global.settings.root_dir + path;
		} else {
			path = global.settings.views + data.control + '/' + path;
		}
		return fs.readFileSync(path);
	}

	/*
	 * 这里编写事件
	 * 
	 * 格式：
	 * 
	 * def.**=  或者  def['**']=
	 * 
	 */
	 
	return def;
}