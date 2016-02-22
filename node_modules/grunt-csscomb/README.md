# grunt-csscomb [![Build Status](https://secure.travis-ci.org/csscomb/grunt-csscomb.png?branch=master)](http://travis-ci.org/csscomb/grunt-csscomb) [![NPM version](https://badge.fury.io/js/grunt-csscomb.png)](http://badge.fury.io/js/grunt-csscomb)

> The grunt plugin for sorting CSS properties in specific order.

## Getting Started

This plugin requires Grunt `0.4.x`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-csscomb --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-csscomb');
```

## The "csscomb" task

### Overview
In your project's Gruntfile, add a section named `csscomb` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    csscomb: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    }
});
```

### Options

#### options.config
Type: `String`
Default value: `null`

A string value that is used to specify custom-csscomb.json file path.

### Usage Examples

```js
grunt.initConfig({
    csscomb: {
        foo: {
            files: {
                'dest/resorted-foo.css': ['src/foo.css'],
            },
        },
        bar: {
            files: {
                'dest/resorted-foo.css': ['src/foo.css'],
                'dest/resorted-bar.css': ['src/bar.css'],
            },
        }
    }
});
```

#### Custom Options

You can set the `config` option if you want to use the configuration which you are accustomed to.

```js
grunt.initConfig({
    csscomb: {
        dist: {
            options: {
                config: '/path/to/config.json'
            },
            files: {
                'dest/resorted-foo.css': ['src/foo.css'],
            }
        }
    }
});
```

#### Dynamic Mappings

You can process many individual files of directory with a few additional properties.

```js
grunt.initConfig({
    csscomb: {
        dynamic_mappings: {
            expand: true,
            cwd: '/assets/css/',
            src: ['*.css', '!*.resorted.css'],
            dest: '/assets/dest/css/',
            ext: '.resorted.css'
        }
    }
});
```

## Release History


+ v2.0.1: Stop searching config if we reach root directory.
+ v2.0.0: Bump up.
+ v1.2.1: Bump up.
+ v1.2.0: Update csscomb.js to version 2.0 and change `sortOrder` to `config`.
+ v1.1.0: Improve process.
+ v1.0.0: Support [csscomb.js](http://github.com/csscomb/csscomb.js).
+ v0.5.0: Enable multiple files.
+ v0.4.0: Move to csscomb's repository.
+ v0.3.0: Fix sort option bug.
+ v0.2.0: Fix bugs.
+ v0.1.0: Release.