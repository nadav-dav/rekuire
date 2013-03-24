"use strict";

var fs = require('fs-extra');

var base = __dirname + "/../";

describe("Testing 'rekuire'",function(){

    beforeEach(function(){
        var setupDone = false;
        runs( function () {
            copyReqToNodeModules(function(){
                setupDone = true;
            });
        });
        waitsFor(function () { return !!setupDone; } , 'Timed out', 100);
    });

    afterEach(function(){
        clearNodeModules();
    });



    describe("when running",function(){
        it("should retrieve it according to the file name",function(){
            runs(function(){
                var rekuire = require('rekuire');
                var imported = rekuire('someModule.js');
                expect(imported).toBe("some module");
            });
        });

        it("should add '.js' to the module name if not present",function(){
            runs(function(){
                var rekuire = require('rekuire');
                var imported = rekuire('someModule');
                expect(imported).toBe("some module");
            });
        });

        it("should retrieve it according to relative path",function(){
            runs(function(){
                var rekuire = require('rekuire');
                var imported = rekuire('./testResources/nestedPackage/someModule.js');
                expect(imported).toBe("some module");
            });
        });

        it("should retrieve module from node_modules",function(){
            runs(function(){
                var rekuire = require('rekuire');
                var fse = rekuire('fs-extra');
                expect(fse).not.toBeNull();
            });
        });

        it("should retrieved node framework modules",function(){
            runs(function(){
                var rekuire = require('rekuire');
                var fse = rekuire('fs');
                expect(fse).not.toBeNull();
            })
        });

        it("should throw an error if not found", function(){
            runs(function(){
                var rekuire = require('rekuire');
                var error = null;
                try{
                    rekuire('no-such-package');
                }catch(e){
                    error = e;
                }
                expect(error).not.toBeNull();
            });
        })
    });
});




// SETUP & TEARDOWN

function copyReqToNodeModules(callback){
    fs.mkdirsSync( base + "/node_modules/rekuire/lib");
    fs.copy(base+"lib/", base + "/node_modules/rekuire/lib", function(){
        fs.copy(base+"package.json", base + "node_modules/rekuire/package.json", callback);
    });
}

function clearNodeModules(){
    fs.removeSync( base + "node_modules/rekuire");
}