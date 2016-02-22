Gonzales is a fast CSS parser.    
Gonzales PE is a rework with support of preprocessors.    

Currently those are supported: SCSS, Sass, LESS.

For a plan of future work see [issue #4](https://github.com/tonyganch/gonzales-pe/issues/4).

## Install

To install globally:

    npm install gonzales-pe -g

To install as a project dependency:

    npm install gonzales-pe

To install dev branch:

    npm install git://github.com/tonyganch/gonzales-pe.git#dev

To clone from github:

    git clone git@github.com:tonyganch/gonzales-pe.git

## Build

If you installed/cloned the repo from GitHub, make sure to build library files
first.    
It can be done by running `make` in the module's root directory.    
`make` will build both Node.js and web versions (all files are comments-free
but not compressed).    
If you need a minified version for production, feel free to use uglifier of
your choice.

## Use

Require Gonzales in your project:

    var gonzales = require('gonzales-pe');

Do something:

    var css = 'a { color: tomato }';
    console.log(gonzales.cssToAST(css));

You can learn more about available methods on [Gonzales usage](doc/Gonzales-Usage.md) page.

AST is described on [Gonzales AST description](doc/AST-Description.md) page.

## Test

To run tests:

    npm test

This command will build library files from sources and run tests on all files
in syntax directories.

Every test has 3 files: source stylesheet, expected AST and expected string
compiled back from AST to css.

If some tests fail, you can find information in test logs:

- `log/test.log` contains all information from stdout;
- `log/expected.txt` contains only expected text;
- `log/result.txt` contains only result text.

The last two are made for your convenience: you can use any diff app to see
the defference between them.

If you want to test one specific string or get a general idea of how Gonzales
works, you can use `test/ast.js` file.    
Simply change the first two strings (`css` and `syntax` vars) and run:

    node test/ast.js

Please remember to also run `make` every time you modify any source files.

## Report

If you find a bug or want to add a feature, welcome to [Issues](https://github.com/tonyganch/gonzales-pe/issues).

If you are shy but have a question, feel free to [drop me a
line](mailto:tonyganch+gonzales@gmail.com).
