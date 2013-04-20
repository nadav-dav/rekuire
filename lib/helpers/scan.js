"use strict";

var fs = require("fs"),
    path = require('path');
var filesInProject = {};

module.exports = scan;

var scanned = false;

function scan(dir){
    if(scanned){
        return filesInProject;
    }else{
        filesInProject = _scan(dir);
        scanned = true;
        return filesInProject;
    }
}



function _scan (dir){
    var file, files, filePath, _i, _len;
    files = fs.readdirSync(dir);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        filePath = path.normalize(dir + "/" + file);
        if (shouldScanFurther(dir,file)){
            _scan(filePath);
        }else{
            if ( path.extname(file) === '.js'){
                if (filesInProject[file] !== undefined){
                    throw "Ambiguity error, there are two modules with the name "+file;
                }else{
                    filesInProject[file] = filePath;
                }
            }
        }
    }
    return filesInProject;
}

function shouldScanFurther(root,file){
    if ( file === "node_modules" ||
        file.substr(0,1) === "." ||
        !fs.statSync(root+"/"+file).isDirectory()) {
        return false;
    }else{
        return true;
    }
}