var request = require('request');
module.exports = function (req, res) {
    var value;
    request('http://www.baidu.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            value = body;
            console.warn(body); 
            //console.log(body) // Show the HTML for the Google homepage. 
        }
    });
    console.warn('run go');
    return {
        value: 'd' ,
        req: req,
        res: res,
        type: 'text'
    };
};