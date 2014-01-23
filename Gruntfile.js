module.exports = function(grunt) {

  grunt.util.linefeed = '\n';

    // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner:'/*!\n' +
              ' * Furatto v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',

    clean: {
      dist: 'dist'
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      furatto: {
        src: [
          'js/modal.js',
          'js/navigation-bar.js',
          'js/off-screen.js',
          'js/responsiveTables.js',
          'js/suraido.js',
          'js/toolbar.js',
          'js/tooltip.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      furatto: {
        options: {
          banner: '<%= banner %>',
          report: 'min'
        },
        src: '<%= concat.furatto.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: 'dist/css',
          environment: 'development',
          outputStyle: 'expanded',
          raw: 'preferred_syntax = :scss\n'
        } 
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css',
        src: ["furatto.css", "furatto.min.css"],
        dest: 'dist/css',
        ext: '.min.css'
      }
    },

    jekyll: {
      docs: {}
    },

    watch: {
      sass: {
        files: 'scss/furatto/*.scss',
        tasks: 'compass:dist'
      },
      coffee: {
        files: 'coffee/*.coffee',
        tasks: ['coffee', 'concat', 'uglify']
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/<%= pkg.name %>.css',
            'dist/js/<%= pkg.name %>.js'
          ]
        }
      }
    },

    copy: {
      docs: {
        expand: true,
        src: [
          'dist/css/*',
          'dist/js/*'
        ],
        dest: 'docs'
          
      } 
    },

    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'js/modal.js': 'coffee/modal.coffee',
          'js/navigation-bar.js': 'coffee/navigation-bar.coffee',
          'js/responsiveTables.js': 'coffee/responsiveTables.coffee',
          'js/suraido.js': 'coffee/suraido.coffee',
          'js/toolbar.js': 'coffee/toolbar.coffee'
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  // CSS distribution task.
  grunt.registerTask('dist-css', ['compass:dist', 'cssmin']);
  grunt.registerTask('dist-js', ['coffee', 'concat', 'uglify']);
  grunt.registerTask('dist-docs', ['copy:docs']);

  // Docs distribution task.
  //grunt.registerTask('dist-docs', 'copy:docs');

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-docs', 'usebanner']);

  // Default task.
  //grunt.registerTask('default', ['test', 'dist', 'build-glyphicons-data', 'build-customizer']);

};
