/*
 * grunt-csscomb
 * https://github.com/csscomb/grunt-csscomb
 *
 * Copyright (c) 2013 Koji Ishimoto
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/fixtures/tmp_*.css','test/fixtures/dest/*.resorted.css'],
        },

        // Configuration to be run (and then tested).
        csscomb: {
            main: {
                files: {
                    'test/fixtures/tmp_resort.css': ['test/fixtures/style.css'],
                }
            },
            custom: {
                options: {
                    config: 'test/fixtures/sort.json'
                },
                files: {
                    'test/fixtures/tmp_customsort.css': ['test/fixtures/style.css'],
                }
            },
            multiple: {
                files: {
                    'test/fixtures/tmp_multi1.css': ['test/fixtures/multi1.css'],
                    'test/fixtures/tmp_multi2.css': ['test/fixtures/multi2.css'],
                }
            },
            dynamic_mappings: {
                expand: true,
                cwd: 'test/fixtures/dest/',
                src: ['*.css', '!*.resorted.css'],
                dest: 'test/fixtures/dest/',
                ext: '.resorted.css'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'csscomb', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};