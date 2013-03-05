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
> ```var rekuire = require('rekuire');```<br/>
> ```var MyModule = rekuire('MyModule.js');```


what does it do?
----------------
> when 'rekuire' is first loaded to the project, it scans the **.js* files,
> then, when you need them they are right there to use!
> no relative paths are needed! *yeahy!*
