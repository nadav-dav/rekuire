var fs = require("fs-extra")

var base = __dirname + "/../../"

exports.createNamePackage = function(){
    fs.mkdirsSync(base+"/node_modules/name")
    fs.writeFileSync(base + "node_modules/name/index.js", "module.exports='root';")
}
exports.createParentPackage = function () {

    // CREATING A PACKAGE
    var indexjs = "" +
        "var rek=require('rekuire');" + "\n" +
        "console.log(rek.filesInProject)" + "\n" +
        "module.exports.rekuireName = rek('name');" + "\n" +
        "module.exports.child = {rekuireName: rek('child-package').rekuireName}" + "\n"
    var packagejson = JSON.stringify({name: 'parent-package', main: 'index.js', "dependencies" : { "rekuire" : "*", "name" : "*"}})
    fs.mkdirsSync(base+"/node_modules/parent-package/node_modules/name")
    fs.writeFileSync(base + "node_modules/parent-package/index.js", indexjs)
    fs.writeFileSync(base + "node_modules/parent-package/package.json", packagejson)

    // CREATING A SUB PACKAGE FOR THE NAME
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/name/index.js", "module.exports='parent-package';")
    var namepackagejson = JSON.stringify({name: 'name', main: 'index.js'})
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/name/package.json", namepackagejson)

    // CREATING REKUIRE IN IT
    fs.copySync(base + "lib", base + "node_modules/parent-package/node_modules/rekuire/lib/");
    fs.copySync(base + "package.json", base + "node_modules/parent-package/node_modules/rekuire/package.json");
}

exports.createParentPackage = function () {

    // CREATING A PACKAGE
    var indexjs = "" +
        "var rek=require('rekuire');" + "\n" +
        "module.exports.rekuireName = function(){return rek('name');};" + "\n" +
        "module.exports.childRekuireName = function(){return rek('child-package').rekuireName();};" + "\n"
    var packagejson = JSON.stringify({name: 'parent-package', main: 'index.js', "dependencies" : { "rekuire" : "*", "name" : "*"}})
    fs.mkdirsSync(base+"/node_modules/parent-package/node_modules/name")
    fs.writeFileSync(base + "node_modules/parent-package/index.js", indexjs)
    fs.writeFileSync(base + "node_modules/parent-package/package.json", packagejson)

    // CREATING A SUB PACKAGE FOR THE NAME
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/name/index.js", "module.exports='parent-package';")
    var namepackagejson = JSON.stringify({name: 'name', main: 'index.js'})
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/name/package.json", namepackagejson)

    // CREATING REKUIRE IN IT
    fs.copySync(base + "lib", base + "node_modules/parent-package/node_modules/rekuire/lib/");
    fs.copySync(base + "package.json", base + "node_modules/parent-package/node_modules/rekuire/package.json");
}

exports.createChildPackage = function(){
    // CREATING A PACKAGE
    var indexjs = "" +
        "var rek=require('rekuire');" + "\n" +
        "module.exports.rekuireName = function(){return rek('name');};" + "\n"
    var packagejson = JSON.stringify({name: 'child-package', main: 'index.js', "dependencies" : { "rekuire" : "*", "name" : "*"}})
    fs.mkdirsSync(base+"node_modules/parent-package/node_modules/child-package/node_modules/name")
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/child-package/index.js", indexjs)
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/child-package/package.json", packagejson)

    // CREATING A SUB PACKAGE FOR THE NAME
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/child-package/node_modules/name/index.js", "module.exports='child-package';")
    var namepackagejson = JSON.stringify({name: 'name', main: 'index.js'})
    fs.writeFileSync(base + "node_modules/parent-package/node_modules/child-package/node_modules/name/package.json", namepackagejson)

    // CREATING REKUIRE IN IT
    fs.copySync(base + "lib", base + "node_modules/parent-package/node_modules/child-package/node_modules/rekuire/lib/");
    fs.copySync(base + "package.json", base + "node_modules/parent-package/node_modules/child-package/node_modules/rekuire/package.json");
}

exports.cleanTestPackages = function(){
    fs.removeSync(base + "node_modules/parent-package")
    fs.removeSync(base + "node_modules/name")
}