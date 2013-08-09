"use strict";

var fs = require("fs"),
    path = require('path');
var scanResults = {};
var filesInProject = {};
var ambiguousFileNames = {};

module.exports = scan;

var scanned = false;

function scan(dir, extensions){
    if(scanned){
        return scanResults;
    }else{
        scanResults = _scan(dir, extensions);
        scanned = true;
        return scanResults;
    }
}



function _scan (dir, extensions){
    var file, files, filePath, _i, _len;
    files = fs.readdirSync(dir);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        filePath = path.normalize(dir + "/" + file);
        if (shouldScanFurther(dir,file)){
            _scan(filePath,extensions);
        }else{
            var ext = path.extname(file);
            var base = path.basename(file,ext);
            if ( extensions.indexOf(ext) !== -1){
                // just base
                if (filesInProject[base] !== undefined){
                    ambiguousFileNames[base] = base;
                }else{
                    filesInProject[base] = filePath;
                }

                // base with extension
                if (filesInProject[file] !== undefined){
                    ambiguousFileNames[file] = file;
                }else{
                    filesInProject[file] = filePath;
                }
            }
        }
    }

    /**
     * @type {{filesInProject: {}, ambiguousFileNames: {}}}
     */
    scanResults = {
        filesInProject : filesInProject,
        ambiguousFileNames : ambiguousFileNames
    };
    return scanResults;
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