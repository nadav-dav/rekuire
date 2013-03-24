"use strict";

var path = require('path'),
    fs = require("fs"),
    _ = require('underscore');

module.exports = rekuire;

var baseDir = path.normalize( __dirname + "/../../../");
var filesInProject = {};
var scanned = false;

if(!scanned) { scan(baseDir); }

/**
 *
 * @extends {require}
 * @inheritDoc
 */
function rekuire(requirement){
    var calleePath = path.dirname(module.parent.filename);
    var retModule = null;
    var error = "";

    var requirementjs = requirement.toLowerCase().substr(-3,3) === '.js' ? requirement : requirement+".js";
    if ( filesInProject[requirementjs] !== undefined){
        retModule =  require(filesInProject[requirementjs]);
    }else{
        var modulePath =  path.normalize(calleePath+"/"+requirement);
        try{
            retModule = require(modulePath);
        }catch(e){
            error += e +"\n";
        }
        if (retModule === null){
            try{
                retModule =  require(requirement);
            }catch(e){
                error += e +"\n";
            }
        }
    }
    if(!retModule){
        throw error;
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