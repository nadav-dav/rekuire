"use strict";

// this prevents Rekuire from being cached, so 'parent' is always updated
delete require.cache[require.resolve(__filename)];

var path = require('path');
var scanner = require('./helpers/scanner');
var findBase = require('./helpers/findBase');
var baseDir = findBase(module.parent.paths);

var pkg = require(path.join(baseDir, "package.json"));
if (pkg.rekuire){
    if (pkg.rekuire.ignore){
        scanner.ignore(pkg.rekuire.ignore);
    }
}
var _ = require('underscore');
var extensions  = ['.js','.json','.coffee'];

// SCANNING THE FOLDERS AS SOON AS THIS FILE LOADS
var scanResults = scanner.scan(baseDir,extensions);
var filesInProject = scanResults.filesInProject;
var ambiguousFileNames = scanResults.ambiguousFileNames;

module.exports = rekuire;

function rekuire(requirement){
    return getModule(requirement).module
}
/**
**********************************
    PUBLIC METHODS
**********************************
**/
rekuire.path = function(requirement){
    return getPath(requirement);
};

rekuire.ignore = function(/*args*/){
    var args = Array.prototype.slice.call(arguments);
    scanner.ignore(args);
    scanResults = scanner.rescan();
    filesInProject = scanResults.filesInProject;
    ambiguousFileNames = scanResults.ambiguousFileNames;
};

/**
**********************************
    PRIVATE METHODS
**********************************
**/

function getPath(requirement){
    var location = getModule(requirement).path;
    if (location === undefined){
        throw "Could not locate a local for a module named ["+requirement+"]";
    }
    return location;
}

function isDefined(val){
    return typeof val === 'string' || typeof val === 'object' ;
}


function getModule(requirement){
    var calleePath = path.dirname(module.parent.filename);
    var parentReq = module.parent.require.bind(module);
    var retModule = null;
    var modulePath = null;
    var error = "";

    if (isDefined(ambiguousFileNames[requirement])){
        throw new Error('Ambiguity Error: There are more then one files that is named '+requirement+
            '. \n\t' + ambiguousFileNames[requirement].join('\n\t') +
            '\nYou can use require("rekuire").ignore("folder_to_ignore") to prevent Rekuire from scanning unwanted folders.');
    }

    if (isDefined(filesInProject[requirement])){        
        // User typed in a relative path
        retModule =  parentReq(filesInProject[requirement]);
        modulePath = filesInProject[requirement];
    }else{
        // User typed in a module name
        modulePath =  path.normalize(calleePath+"/"+requirement);
        try{
            retModule = parentReq(modulePath);
        }catch(e){
            // module by that name was not found in the scanner, maybe it's a general node module.
            error += e +"\n";
        }

        // General node module
        if (retModule == null){
            modulePath = requirement;
            try{
                retModule =  parentReq(requirement);
            }catch(e){
                error += e +"\n";
            }
        }
    }
    if(!retModule){
        throw new Error("Can not find a module by the name of ["+requirement+"] or it has returned empty. nested: "+error);
    }
    return { module: retModule, path: modulePath};
}
