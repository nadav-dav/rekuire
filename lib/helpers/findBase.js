var fs = require('fs');
var path = require('path');
var _ = require('underscore');
function findBase(paths){
	var existingPath = _.find(paths, function(p){
		return fs.existsSync(p);
	})
	return path.normalize(existingPath+"/../");
};
var cachedBase;

module.exports = function(paths){
	if (cachedBase){
		return cachedBase;
	}else {
		cachedBase = findBase(paths);
		return cachedBase;
	}
}