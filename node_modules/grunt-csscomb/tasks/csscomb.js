/*
 * grunt-csscomb
 * https://github.com/csscomb/grunt-csscomb
 *
 * Copyright (c) 2013 Koji Ishimoto, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path');

module.exports = function (grunt) {

    grunt.registerMultiTask('csscomb', 'Sorting CSS properties in specific order.', function () {

        var Comb = require('csscomb'),
            comb = new Comb(),
            HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

        function getConfigPath(configPath) {
            var dirname, parentDirname;

            configPath = configPath || path.join(process.cwd(), '.csscomb.json');

            // If we've finally found a config, return its path:
            if (grunt.file.exists(configPath)) {
                return configPath;
            }

            dirname = path.dirname(configPath);
            parentDirname = path.dirname(dirname);

            // If we are in HOME dir already and yet no config file, quit.
            // If project is located not under HOME, compare to root instead.
            // Since there appears to be no good way to get root path in
            // Windows, assume that if current dir has no parent dir, we're in
            // root.
            if (dirname === HOME || dirname === parentDirname) {
                return;
            }

            // If there is no config in this directory, go one level up and look for
            // a config there:
            configPath = path.join(parentDirname, '.csscomb.json');
            return getConfigPath(configPath);
        }

        // Get config file from task's options:
        var config = grunt.task.current.options().config || getConfigPath();

        // Check if config file is set and exists. If not, use default one:
        if (config && grunt.file.exists(config)) {
            grunt.log.ok('Using custom config file "' + config + '"...');
            config = grunt.file.readJSON(config);
        } else {
            grunt.log.ok('Using default config file...');
            config = comb.getConfig('csscomb');
        }

        // Configure csscomb:
        comb.configure(config);

        this.files.forEach(function (f) {

            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function (src) {

                    // Get CSS from a source file:
                    var css = grunt.file.read(src);

                    // Comb it:
                    grunt.log.ok('Sorting file "' + src + '"...');
                    var syntax = src.split('.').pop();
                    var combed = comb.processString(css, syntax);
                    grunt.file.write(f.dest, combed);
                });
        });
    });
};
