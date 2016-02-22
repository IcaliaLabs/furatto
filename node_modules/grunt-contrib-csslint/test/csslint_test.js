'use strict';

var grunt = require('grunt');

exports.csslint = {
  withReportsAbs: function(test) {
    // check if reports where generated
    test.ok(grunt.file.isDir('tmp'), 'should create a folder "report".');
    test.ok(grunt.file.exists('tmp/csslint.xml'), 'should create a checkstyle report.');
    test.ok(grunt.file.exists('tmp/csslint_junit.xml'), 'should create a junit report.');

    // check if the file names in the reports are absolute
    var checkstyleFile = grunt.file.read('tmp/csslint.xml');
    var junitFile = grunt.file.read('tmp/csslint_junit.xml');

    var path = checkstyleFile.substring(checkstyleFile.indexOf('file name="') + 'file name="'.length, checkstyleFile.indexOf('invalid.css') + 'invalid.css'.length);
    test.ok(grunt.file.exists(path), 'should reference the right file.');
    test.ok(grunt.file.isFile(path), 'should reference the right file.');
    test.ok(grunt.file.isPathAbsolute(path), 'should generate an absolute file path.');

    path = junitFile.substring(junitFile.indexOf('name="') + 'name="'.length, junitFile.indexOf('invalid.css') + 'invalid.css'.length);
    test.ok(grunt.file.exists(path), 'should reference the right file.');
    test.ok(grunt.file.isFile(path), 'should reference the right file.');
    test.ok(grunt.file.isPathAbsolute(path), 'should generate an absolute file path.');

    test.done();
  },
  withReportsRel: function(test) {
    // check if reports where generated
    test.ok(grunt.file.isDir('tmp'), 'should create a folder "report".');
    test.ok(grunt.file.exists('tmp/csslintRel.xml'), 'should create a checkstyle report.');

    // check if the file names in the reports are absolute
    var checkstyleFile = grunt.file.read('tmp/csslintRel.xml');
    var path = checkstyleFile.substring(checkstyleFile.indexOf('file name="') + 'file name="'.length, checkstyleFile.indexOf('invalid.css') + 'invalid.css'.length);

    test.ok(grunt.file.exists(path), 'should reference the right file.');
    test.ok(grunt.file.isFile(path), 'should reference the right file.');
    test.equal(grunt.file.isPathAbsolute(path), false, 'should generate a relative file path.');

    test.done();
  }
};
