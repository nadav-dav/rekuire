"use strict";

var rek = require('rekuire');
var fs = rek('fs');
module.exports = ModuleToBeExported;

function ModuleToBeExported(){}
ModuleToBeExported.prototype.getFs = function (){
    rek('fs');
    return fs;
}