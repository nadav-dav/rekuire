var rek = require('rekuire');
module.exports = {
	getInnerModule: function(){
		return rek('inner-module');
	}
};