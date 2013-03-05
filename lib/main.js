"use strict";

var path = require('path'),
    fs = require("fs"),
    _ = require('underscore');

module.exports = rekuire;

var baseDir = path.normalize( __dirname + "/../../../");
var filesInProject = {};
var scanned = false;

if(!scanned) { scan(baseDir); }

function rekuire(requirement){
    var calleePath = path.dirname(module.parent.filename);
    var retModule = null;
    if ( filesInProject[requirement] !== undefined){
        retModule =  require(filesInProject[requirement]);
    }else{
        try{
            retModule = require( path.normalize(calleePath+"/"+requirement));
        }catch(e){}
        if (retModule === null){
            try{
                retModule =  require(requirement);
            }catch(e){}
        }
    }
    return retModule;
}

function scan (dir){
    scanned = true;
    var file, files, filePath, _i, _len;
    files = fs.readdirSync(dir);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        filePath = path.normalize(dir + "/" + file);
        if (shouldScanFurther(dir,file)){
            scan(filePath);
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
}

function shouldScanFurther(root,file){
    if (root.indexOf("node_modules") !== -1 ||
        file.substr(0,1) === "." ||
        !fs.statSync(root+"/"+file).isDirectory()) {
        return false;
    }else{
        return true;
    }
}