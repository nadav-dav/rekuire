var fs = require('fs');
var path = require('path');
var find = require('lodash.find');

function findBase(paths){
	var existingPath = find(paths, function(p){
		return fs.existsSync(p);
	});
	return path.normalize(existingPath+"/../");
}

var cachedBase;

module.exports = function(paths){
	if (cachedBase){
		return cachedBase;
	}else {
		cachedBase = findBase(paths);
		return cachedBase;
	}
}