Rekuire
=========
'rekuire' is basically node's 'require' without the relative paths

installation
-------------
to install, type
>```npm install rekuire```


so how to use it?
-----------------
> instead of doing this: 

> ```var MyModule = require('../../../MyModule.js');``` *<-- yuck!*

> &nbsp;
> why not do this:<br/>
> ```var rek = require('rekuire');```<br/>
> ```var MyModule = rek('MyModule.js');```

> if you want to resolve only the file location, for example, when you want to use [proxyquire][proxyquire].<br/>
> use: <br/>
> ```var mypath = rek().path('MyModule');```<br/>
> ```// mypath = 'lib/classes/MyModule.js' ```

- - - 

what does it do?
----------------
> when 'rekuire' is first loaded to the project, it scans the **.js* files,
> then, when you need them they are right there to use!
> no relative paths are needed! *yeahy!*

- - -

Development
-------------
> To test, run: ```npm test```



[proxyquire]:https://github.com/thlorenz/proxyquire