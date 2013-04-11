"use strict";

var path = require('path'),
    fs = require("fs"),
    _ = require('underscore');

// this prevents Rekuire from being cached, so 'parent' is always updated
delete require.cache[require.resolve(__filename)];

module.exports = function(){
    return rekuire.apply(this,arguments);
};

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
    if (isString(requirement)){
        return getModule(requirement).module
    }else{
        return {
            path: getPath
        }
    }
}

function getPath(requirement){
    var location = getModule(requirement).path;
    if (location === undefined){
        throw "Could not locate a local for a module named ["+requirement+"]";
    }
    return location;
}

function getModule(requirement){
    var calleePath = path.dirname(module.parent.filename);
    var parentReq = module.parent.require.bind(module);
    var retModule = null;
    var modulePath = null;
    var error = "";

    var requirementjs = requirement.toLowerCase().substr(-3,3) === '.js' ? requirement : requirement+".js";

//    console.log(module.parent.require.extensions);
    if ( filesInProject[requirementjs] !== undefined){
        // Relative Path
        retModule =  parentReq(filesInProject[requirementjs]);
        modulePath = filesInProject[requirementjs];
    }else{
        // No Path
        modulePath =  path.normalize(calleePath+"/"+requirement);
        try{
            retModule = parentReq(modulePath);
        }catch(e){
            error += e +"\n";
        }

        // General node module
        if (retModule === null){
            modulePath = null;
            try{
                retModule =  parentReq(requirement);
            }catch(e){
                error += e +"\n";
            }
        }
    }
    if(!retModule){
        throw error;
    }
    return { module: retModule, path: modulePath};
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
    if ( file === "node_modules" ||
         file.substr(0,1) === "." ||
         !fs.statSync(root+"/"+file).isDirectory()) {
        return false;
    }else{
        return true;
    }
}

function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}