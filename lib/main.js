"use strict";

// this prevents Rekuire from being cached, so 'parent' is always updated
delete require.cache[require.resolve(__filename)];


var path = require('path'),
    _ = require('underscore'),
    isString = require('./helpers/isString'),
    scan = require('./helpers/scan');
var baseDir = path.normalize( __dirname + "/../../../");
var scanResults = scan(baseDir);
var filesInProject = scanResults.filesInProject;
var ambiguousFileNames = scanResults.ambiguousFileNames;




module.exports = rekuire;

function rekuire(requirement){
    if (isString(requirement)){
        return getModule(requirement).module
    }else{
        return {
            path: getPath
        }
    }
}

rekuire.path = function(requirement){
    return getPath(requirement);
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

    var requirementjsHasExtension = requirement.toLowerCase().match(/\.(js|json)$/);
    var requirementjs = requirementjsHasExtension ? requirement : requirement+".js";

    if (ambiguousFileNames[requirement] !== undefined){
        throw new Error('Ambiguity Error: There are more then one files that is named '+requirement);
    }

    if ( filesInProject[requirementjs] !== undefined){
        // User typed in a relative path
        retModule =  parentReq(filesInProject[requirementjs]);
        modulePath = filesInProject[requirementjs];
    }else{
        // User typed in a module name
        modulePath =  path.normalize(calleePath+"/"+requirement);
        try{
            retModule = parentReq(modulePath);
        }catch(e){
            // module by that name was not found in the scan, maybe it's a general node module.
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

