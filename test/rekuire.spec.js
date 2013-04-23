"use strict";

var fs = require('fs-extra'),
    path = require('path'),
    proxyquire = require('proxyquire');

var base = __dirname + "/../";


describe("Testing 'rekuire'",function(){

    beforeEach(function(){
        var setupDone = false;
        runs( function () {
            copyRekToNodeModules(function(){
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
    describe("when rekuiring just the local path", function(){
        it("should return the right path", function(){
            runs(function(){
                var rekuire = require('rekuire');
                var localPath = path.relative(__dirname,rekuire().path('someModule.js'));
                expect(localPath).toEqual(path.normalize("testResources/nestedPackage/someModule.js"));
            });
        });

        it("should return the right path without the use of parentheses", function(){
            runs(function(){
                var rek = require('rekuire');
                var rekPath = rek.path('someModule.js');
                var localPath = path.relative(__dirname,rekPath);
                expect(localPath).toEqual(path.normalize("testResources/nestedPackage/someModule.js"));
            });
        });
        
        it("should return just the module name if its a global module",function(){
            runs(function(){
                var rek = require('rekuire');
                var rekPath = rek.path('fs-extra');
                expect(rekPath).toEqual("fs-extra");
            });
        });

        it("should throw an error if couldn't find", function(){
            runs(function(){
                var rekuire = require('rekuire');
                var error = null;
                try{
                    rekuire().path('no-such-package');
                }catch(e){
                    error = e;
                }
                expect(error).not.toBeNull();
            });
        });

    });

    describe("when used with proxyrequire", function(){
        it("should be able rekuires to be replaced", function(){
            var rek = require('rekuire');
            var fakeFs = {this_module:"is fake"};
            var ModuleToBeProxied = proxyquire(rek().path('ModuleToBeProxied'),{fs:fakeFs});
            var instance = new ModuleToBeProxied();
            expect(instance.getFs()).toBe(fakeFs);
        });
    });
});




// SETUP & TEARDOWN

function copyRekToNodeModules(callback){
    fs.mkdirsSync( base + "/node_modules/rekuire/lib");
    fs.copy(base+"lib/", base + "/node_modules/rekuire/lib", function(){
        fs.copy(base+"package.json", base + "node_modules/rekuire/package.json", callback);
    });
}

function clearNodeModules(){
    fs.removeSync( base + "node_modules/rekuire");
}