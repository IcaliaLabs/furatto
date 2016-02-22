/*
 * grunt-banner
 * https://github.com/mattstyles/grunt-banner
 *
 * Copyright (c) 2014 Matt Styles
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('usebanner', 'Adds a banner or a footer to a file', function() {
        // Set up defaults for the options hash
        var options = this.options({
            position: 'top',
            banner: '',
            linebreak: true,
            process: false
        });

        if ( options.position !== 'top' && options.position !== 'bottom' ) {
            options.position = 'top';
        }

        var linebreak = options.linebreak ? grunt.util.linefeed : '';

        // Iterate over the list of files and add the banner or footer
        this.files.forEach( function( file ) {
            file.src.forEach( function( src ) {
                if ( grunt.file.isFile( src ) ) {

                    if ( typeof options.process === 'function' ) {
                        options.banner = options.process( src );
                    }

                    grunt.file.write( src,
                        options.position === 'top' ? options.banner + linebreak + grunt.file.read( src ) : grunt.file.read( src ) + linebreak + options.banner
                    );

                    grunt.verbose.writeln( 'Banner added to file ' + src.cyan );
                }

            });
        });

        grunt.log.writeln( '✔'.magenta + ' grunt-banner completed successfully' );

    });

};
