module.exports = function (req, res) {
	return {
		value: '你进入了个奇怪的地方。',
		req: req,
		res: res,
		type: 'error'
	};
};