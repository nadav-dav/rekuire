"use strict";

var fs = require("fs"),
    path = require('path');
var scanResults = {};
var filesInProject = {};
var ambiguousFileNames = {};

module.exports = scan;

var scanned = false;
var baseDir

function scan(dir, extensions){
    if(scanned){
        return scanResults;
    }else{
        baseDir = dir;
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
            var relative = path.relative(baseDir,dir);
            if ( ~extensions.indexOf(ext) ){

                // adding the full relative path
                if  (base === "index"){
                    insertPathToIndex(relative,filePath);
                }else{
                    insertPathToIndex(relative+"/"+base,filePath);
                    insertPathToIndex(relative+"/"+file,filePath);
                }

                // just base
                insertPathToIndex(base,filePath);

                // base with extension
                insertPathToIndex(file,filePath);
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

function insertPathToIndex(alias, realpath){
    if (filesInProject[alias] !== undefined){
        ambiguousFileNames[alias] = alias;
    }else{
        filesInProject[alias] = realpath;
    }
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