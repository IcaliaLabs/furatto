  /*
 * grunt-contrib-csslint
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Jörn Zaefferer, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run
    csslint: {
      valid: 'test/fixtures/valid.css',
      empty: 'test/fixtures/empty.css',
      all: 'test/fixtures/*.css',
      custom: {
        options: {
          'import': 0,
          'ids': 0
        },
        files: ['test/fixtures/invalid.css']
      },
      withReportsAbs: {
        options: {
          absoluteFilePathsForFormatters: true,
          formatters: [
            {id: 'junit-xml', dest: 'tmp/csslint_junit.xml'},
            {id: 'csslint-xml', dest: 'tmp/csslint.xml'}
          ]
        },
        src: 'test/fixtures/*.css'
      },
      withReportsRel: {
        options: {
          formatters: [
            {id: 'csslint-xml', dest: 'tmp/csslintRel.xml'}
          ]
        },
        src: 'test/fixtures/*.css'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-internal');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "report" dir then run this
  // plugin's task(s), manually check the output, then run `grunt csslint:all` and `grunt csslint:custom` to look at lint errors
  grunt.registerTask('test', ['clean', 'csslint', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);

};
