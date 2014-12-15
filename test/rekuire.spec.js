"use strict";

var fs = require('fs-extra'),
    path = require('path'),
    proxyquire = require('proxyquire');
var base = __dirname + "/../";


describe("Testing 'rekuire'",function(){

    beforeEach(function(){
        copyRekToNodeModules(file('node_modules'));
    });

    afterEach(function(){
        clearRekuireFromNodeModules();
    });


    describe("when running",function(){
        it("should retrieve it according to the file name",function(){
            var rek = require('rekuire');
            var imported = rek('someModule.js');
            expect(imported).toBe("some module");
        });

        it("should retrieve it according to the relative path within the project", function(){
            var rek = require('rekuire');
            var imported = rek('test/testResources/nestedPackage/someModule.js');
            expect(imported).toBe("some module");
        });

        it("should distinct among file type", function(){
            var rek = require('rekuire');
            var error;
            var sameNameJs = rek('sameName.js');
            var sameNameJson = rek('sameName.json');
            var sameNameCoffee = rek('sameName.coffee');
            try{
                rek('sameName'); // should return ambiguity error
            }catch(e){
                error = e;
            }

            expect(sameNameJs ).toEqual("sameName.js");
            expect(sameNameCoffee ).toEqual("sameName.coffee");
            expect(sameNameJson ).toEqual({"name":"same"});
            expect(error ).not.toBeNull();
        });

        it("should retrieve it according to the file name (*.json)",function(){
            var rek = require('rekuire');
            var imported = rek('someJsonObject.json');
            expect(imported).toEqual({"someKey":"someValue"});
        });

        it("should retrieve it according to the file name (*.coffee)",function(){
            var rek = require('rekuire');
            var withExt = rek('cup.coffee');
            var withoutExt = rek('cup');
            expect(withExt ).toEqual("cup of coffee")
            expect(withExt ).toEqual(withoutExt );
        });

        it("should get module by name even if extension not present",function(){
            var rek = require('rekuire');
            var jsModule = rek('someModule');
            var jsonObject = rek('someJsonObject');

            expect(jsModule).toBe("some module");
            expect(jsonObject).toEqual({"someKey":"someValue"});
        });

        it("should retrieve it according to relative path",function(){
            var rek = require('rekuire');
            var imported = rek('./testResources/nestedPackage/someModule.js');
            expect(imported).toBe("some module");
        });

        it("should retrieve module from node_modules",function(){
            var rek = require('rekuire');
            var fse = rek('fs-extra');
            expect(fse).not.toBeNull();
        });

        it("should retrieved node framework modules",function(){
            var rek = require('rekuire');
            var fse = rek('fs');
            expect(fse).not.toBeNull();
        });

        it("should throw an error if not found", function(){
            var rek = require('rekuire');
            var error = null;
            try{
                rek('no-such-package');
            }catch(e){
                error = e;
            }
            expect(error).not.toBeNull();
        })

        it("should be able to retrieve files named like a default method", function(){
            var rek = require('rekuire');
            expect(rek('toString')).toEqual('toString');
            expect(rek('prototype')).toEqual('prototype');
        });
    });

    describe("when rekuiring a name that matches two files in the system",function(){
        it("should throw an error", function(){
            var rek = require('rekuire');
            var error = null;
            try{
                rek('SameNamedModule');
            }catch(e){
                error = e;
            }
            expect(error).not.toBeNull();
        });

        it("should specify the conflictions", function(){
            var rek = require('rekuire');
            var error = null;
            try{
                rek('SameNamedModule');
            }catch(e){
                error = e;
            }
            expect(error.message).toContain("test/testResources/nestedPackage/folder1/SameNamedModule.js");
            expect(error.message).toContain("test/testResources/nestedPackage/folder2/SameNamedModule.js");
        });
    });

    describe("when rekuiring just the local path", function(){

        it("should return the right path", function(){
            var rek = require('rekuire');
            var rekPath = rek.path('someModule.js');
            var localPath = path.relative(__dirname,rekPath);
            expect(localPath).toEqual(path.normalize("testResources/nestedPackage/someModule.js"));
        });
        
        it("should return just the module name if its a global module",function(){
            var rek = require('rekuire');
            var rekPath = rek.path('fs-extra');
            expect(rekPath).toEqual("fs-extra");
        });

        it("should throw an error if couldn't find", function(){
            var rek = require('rekuire');
            var error = null;
            try{
                rek().path('no-such-package');
            }catch(e){
                error = e;
            }
            expect(error).not.toBeNull();
        });

    });

    describe("when used with proxyrequire", function(){
        it("should be able rekuires to be replaced", function(){
            var rek = require('rekuire');
            var fakeFs = {this_module:"is fake"};
            var ModuleToBeProxied = proxyquire(rek.path('ModuleToBeProxied'),{fs:fakeFs});
            var instance = new ModuleToBeProxied();
            expect(instance.getFs()).toBe(fakeFs);
        });
    });

    describe("when rekuiring a folder path with index.js in it", function(){
        it("should return the index file", function(){
            var rek = require('rekuire');
            var imported = rek('test/testResources/nestedPackage/folderWithIndex');
            expect(imported).toBe("index file content");
        });
    });

    describe('when node_modules is a symlink to other folder', function() {
        it('should return the right module, even from rekuire is brought via a symlink', function (done) {
            try {
                createPackageThatItsNodeModulesFolderIsSymlink()
                var packageWithSymlink = require('package-with-symlink-example');
                expect(packageWithSymlink.getInnerModule()).toEqual('success');    
                done();
            } finally {
                cleanUp();
            }

            function createPackageThatItsNodeModulesFolderIsSymlink(){
                fs.copySync     (file('/test/testResources/package-with-symlink-example/package'), file('/node_modules/package-with-symlink-example'));
                copyRekToNodeModules(file('/test/testResources/package-with-symlink-example/node_modules'));
                fs.symlinkSync  (file('/test/testResources/package-with-symlink-example/node_modules'), file('node_modules/package-with-symlink-example/node_modules'));     
            }

            function cleanUp (){
                fs.removeSync(file('/node_modules/package-with-symlink-example'));
                fs.removeSync(file('/test/testResources/package-with-symlink-example/node_modules/rekuire'));
            }
        });
    });

    describe("ignoring", function(){
        it("should be able to ignore folders", function(){
            var rek = require('rekuire');
            rek.ignore('test/testResources/ignored-by-code','test/testResources/target')
            var found = null;
            try{
                found = rek('shouldNotFind');
            }catch(e){}
            expect(found ).toBeNull();
        });
        it("should be able to ignore folder specified in the package file", function(){
            var rek = require('rekuire');
            var found = null;
            // shouldNotFind2 is located inside "ignored-by-package-json" folder
            // that has been added to the ignore list in `package.json`
            try{
                found = rek('shouldNotFind2');
            }catch(e){}
            expect(found ).toBeNull(); 
        })
    });

    describe("when two packages are using Rekuire, one is nested inside the other", function(){
        it("should each rekuire modules from the package scope", function(){
            createNamePackage();
            createPackageWithNestedPackage();
            var rek = require('rekuire');
            var pkgWithChild = rek('parent-package');
            expect(rekuireName()).toEqual("root");
            expect(pkgWithChild.rekuireName()).toEqual("parent-package");
            expect(pkgWithChild.rekuireChild().rekuireName()).toEqual("child-package");
            cleanUp();


            function createNamePackage(){
                fs.copySync(file('/test/testResources/nested-modules-example/name'), path.resolve(base + '/node_modules/name'));
            }
            function rekuireName(){
                return rek('name');
            }
            function cleanUp(){
                fs.removeSync(path.resolve(path.resolve(base + '/node_modules/name')));
                fs.removeSync(path.resolve(path.resolve(base + '/node_modules/parent-package')));
            }
            function createPackageWithNestedPackage(){
                fs.copySync(file('/test/testResources/nested-modules-example/parent-package'), file('/node_modules/parent-package'));
                copyRekToNodeModules(file('/node_modules/parent-package/node_modules/child-package/node_modules'));
                copyRekToNodeModules(file('/node_modules/parent-package/node_modules'));
            }
        })
    });

});



/*
 **********************
 UTILS
 **********************
 */
function file(location){
    return path.resolve(base + location);
}

// SETUP & TEARDOWN
function copyRekToNodeModules(node_modules){
    fs.mkdirsSync( node_modules+"/rekuire/lib");
    fs.copySync(file("lib/"), node_modules+"/rekuire/lib")
    fs.copySync(file("package.json"), node_modules+"/rekuire/package.json");
}

function clearRekuireFromNodeModules(){
    fs.removeSync(file("node_modules/rekuire"));
}
