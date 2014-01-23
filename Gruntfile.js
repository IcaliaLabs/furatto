module.exports = function(grunt) {

    // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: 'dist'
    },

    csslint: {
      src: [
        'dist/css/furatto.css',
        'dist/css/examples.css',
        'dist/css/docs.css'
      ]
    },

    concat: {
      options: {
        separator: ';' 
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
      }
    }

  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  // CSS distribution task.
  grunt.registerTask('dist-css', ['compass:dist', 'cssmin']);

  // Docs distribution task.
  //grunt.registerTask('dist-docs', 'copy:docs');

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css']);

  // Default task.
  //grunt.registerTask('default', ['test', 'dist', 'build-glyphicons-data', 'build-customizer']);

};
