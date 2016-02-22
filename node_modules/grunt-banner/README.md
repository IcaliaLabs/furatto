# grunt-banner [![Build Status](https://travis-ci.org/mattstyles/grunt-banner.png?branch=master)](https://travis-ci.org/mattstyles/grunt-banner)

> Adds a simple banner to files


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-banner --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-banner');
```

Or if you are using [matchdep](https://github.com/tkellen/node-matchdep) it will be included along with other `grunt-*` tasks by using this line of JS:

```js
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
```


## The "usebanner" task

_grunt-banner renamed it’s task from `banner` to `usebanner` as a `banner` is often used to hold a banner template for a number of grunt plugins_


### Overview

In your project's Gruntfile, add a section named `usebanner` to the data object passed into `grunt.initConfig()`.

The wildcard selector `*` is perfectly valid for selecting targets to add a banner to.

```js
grunt.initConfig({
  usebanner: {
    taskName: {
      options: {
        position: 'top' || 'bottom',
        banner: '// banner text <%= templates encouraged %>',
        linebreak: true || false
      },
      files: {
        src: [ 'path/to/file.ext', 'path/to/another/*.ext' ]
      }
    }
  }
})
```


### Options

#### options.position
Type: `String`
Default value: `'top`
Value range: `'top'` or `'bottom'` only

The position to place the banner - _either_ the top or bottom (other values will default to top)

#### options.banner
Type: `String`
Default value: ``

The text to use as a banner.  Templated strings are perfectly acceptable and encouraged.

#### options.linebreak
Type: `Boolean`
Default value: `true`

Set `linebreak` to true to add a line break between banner and file content.

#### options.process
Type: `Function`

Allows the banner to be generated for each file using the output of the process function.


### Usage Examples

#### Basic Usage

In this example an `appConfig` is read from a JSON file and used to populate a `banner` template which is then used by `grunt-banner` to place at the top of some files.  Each file in the array will have the banner placed on to it and all `.js` files in the `/more-scripts/` folder will have a banner thanks to the `*` wildcard.

```js
var appConfig = grunt.file.readJSON( 'app-config.json' ) || {};
grunt.initConfig({
  banner: '/* <%= appConfig.info.name %> - version <%= appConfig.info.version %> - ' +
          '<%= grunt.template.today("dd-mm-yyyy") %>\n' +
          '<%= appConfig.info.description %>\n ' +
          '&#169 <%= grunt.template.today("yyyy") %> <%= appConfig.info.author.name %> ' +
          '- <%= appConfig.info.author.email %> */\n',
  usebanner: {
    dist: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [ 'scripts/main-min.js', 'stylesheets/main-min.css', 'more-scripts/*.js' ]
      }
    }
  }
})
```


#### Process Usage

By supplying a process function you effectively take control of how the banner is generated, the task is still responsible for placing it. In essence, it replaces the need for a banner object being specified in your grunt config as you are creating it from code for each file. This gives you the flexibility to add file-specific data to your banners.

This example uses [grunt templating](http://gruntjs.com/api/grunt.template) to generate a banner that references the file name it is being appended to. Run the test cases to see this in action.

```js
usebanner: {
  dist: {
    options: {
      position: 'top',
      process: function( filepath )
        return grunt.template.process(
          '// banner for file: <%= filename %>',
          { data: {
            filename: filepath.match(/\/([^/]*)$/)[1]
          } } );
        }
      },
      files: {
        src: [ 'test/tmp/someProcess.js' ]
      }
  }
}
```


### Notes

`grunt-banner` simply adds the banner to the head or foot of the files that are specified by the array passed to `files.src`, it makes no attempt to see if a banner already exists and it is up to the user to ensure that the file should not already contain a banner.  To this end it is recommended to use the [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean) task and only add banners to production-ready code.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

---

Task submitted by [Matt Styles](http://veryfizzyjelly.com/coding/introducing-grunt-booty) [@personalurban](https://twitter.com/personalurban)
