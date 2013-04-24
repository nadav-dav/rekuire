Rekuire [![NPM version](https://badge.fury.io/js/rekuire.png)](http://badge.fury.io/js/rekuire)
=========
'rekuire' is basically node's 'require' without the relative paths

installation
-------------
to install, type
> ```npm install rekuire```


so how to use it?
-----------------
instead of doing this: <br/>
> ```var MyModule = require('../../../MyModule.js');``` *<-- yuck!*

why not do this:<br/>
> ```var rek = require('rekuire');```<br/>
> ```var MyModule = rek('MyModule.js');```

if you want to resolve only the file location, for example, when you want to use [proxyquire][proxyquire].<br/>
use: <br/>
> ```var mypath = rek.path('MyModule');```<br/>
> ```// mypath = 'lib/classes/MyModule.js' ```

what is it good for?
--------------------
it saves you TONS of time refactoring your code, and making it easily reusable.
plus, it makes you code more readable = better!

- - - 

what does it do?
----------------
when 'rekuire' is first loaded to the project, it scans the **.js* files,
then, when you need them they are right there to use!
no relative paths are needed! *yeahy!*

- - -

Development
-------------
To test, run: ```npm test```


[proxyquire]:https://github.com/thlorenz/proxyquire
