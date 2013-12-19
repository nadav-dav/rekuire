Rekuire [![NPM version](https://badge.fury.io/js/rekuire.png)](http://badge.fury.io/js/rekuire)
=========
'rekuire' is basically node's 'require' without the relative paths!

It saves you TONS of time refactoring your code, and making it easily reusable.
plus, it makes you code more *readable* = **better!**

Installation
-------------
to install, type
> ```npm install rekuire```

or add it to your ```package.json``` as a dependency.
<br/>
- - - 
Whats new?
----------
####0.1.5
> * fixed a bug that causes failures when scanning a package with higher os privileges (thanks [Danny][danny]!)

####0.1.4
> * added a method to ignore folders while searching the right files (for example, the js files in the server's static folder)

####0.1.3
> * you can now rekuire file according to the relative path of the file
> * added support for *index.js* files inside a folder - can be retrieved by the folder path

####0.1.2
> * added support for **.coffee** files and **.json**

- - - 

How to use it?
-----------------
instead of doing this: <br/>
> ```var MyModule = require('../../../MyModule.js');``` *<-- yuck!*

why not do this:<br/>
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

<br/>


in order to tell the scanner, not to scan specific folders<br/>
use: <br/>
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

what does it do?
----------------
when 'rekuire' is first loaded to the project, it scans the source files locations,
so when you need them they are right there to use!
no relative paths are needed! *yeahy!*

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
[danny]:https://github.com/danyshaanan
