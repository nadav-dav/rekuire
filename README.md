Rekuire [![NPM version](https://badge.fury.io/js/rekuire.png)](http://badge.fury.io/js/rekuire)
=========
'rekuire' is basically node's 'require' without the relative paths!

It saves you TONS of time refactoring your code, and making it easily reusable.
plus, it makes you code more *readable* = **better!**

Installation
-------------
to install, type
> ```npm install rekuire```

- - - 

How to use it?
-----------------
instead of doing this: <br/>
> ```var MyModule = require('../../../MyModule.js');``` *<-- yuck!*

you can now do this:<br/>
```
var rek = require('rekuire');
var myModule = rek('MyModule');
```
<br/><br/>

or that:<br/>
```
var myCoffee = rek('MyCoffee.coffee');
var myJson = rek('myJson.json');
var myModule = rek('src/api/MyModule');
```
<br/>

Whats new?
----------
####0.1.9
> * Fixed a bug causing the scanner to fail, if the fetched file was named like a default method like 'toString'

####0.1.8
> * Removed deprecated code - `rek().path(...)` will not work anymore, instead use `rek.path(...)`.
> * Fixed an issue of causing `rekuire` not to scan the folders correctly when `node_modules` was a symlink.
> * Added .npmignore to the package - so you won't get the test files when adding dependencies

####0.1.7
> * Now you are able to describe ignored folders in your project inside the `package.json` file!


How does it work?
------------------
when 'rekuire' is first loaded into the project, it scans the source files locations, and stores them.
so when you need them they are right there ready to use!
no relative paths are needed! *yeahy!*

in order to tell the scanner, not to scan specific folders you can configure `rekuire` not to scan folders right from the `package.json` file:

```
...
"rekuire": {
	"ignore": ["out", "dist/target", "client/app"]
}
...

```

or you can set it up by code: <br/>
```
var mypath = rek.ignore('out', 'target', 'static/js');
// you should only do it once in your code
```


<br/>


if you want to resolve only the file location, for example, when you want to use [proxyquire][proxyquire].<br/>
use: <br/>
```
var mypath = rek.path('MyModule');
// mypath = 'lib/classes/MyModule.js' 
```

<br/>

for more examples, I recommend you to checkout the spec file :)

<br/>
- - - 
<br/> 

change log
----------
####0.1.6
> * Added colliding files paths to Ambiguity Error

####0.1.5
> * Fixed a bug that causes failures when scanning a package with higher os privileges (thanks [Dany][dany]!)

####0.1.4
> * Added a method to ignore folders while searching the right files (for example, the js files in the server's static folder)

####0.1.3
> * you can now rekuire file according to the relative path of the file
> * Added support for *index.js* files inside a folder - can be retrieved by the folder path

####0.1.2
> * Added support for **.coffee** files and **.json**

<br/>
- - -
<br/>


issues
-------
if you are having any problems, requests or criticism, don't hesitate to open an [issue, here][issue]

<br/>
- - - 
<br/> 



Development
-------------
To test, run: ```npm test```


[proxyquire]:https://github.com/thlorenz/proxyquire
[issue]:https://github.com/nadav-dav/rekuire/issues
[dany]:https://github.com/danyshaanan
