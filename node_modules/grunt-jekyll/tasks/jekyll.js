'use strict';

module.exports = function (grunt) {
	var fs = require('fs');
	var tmp = require('tmp');
	var exec = require('child_process').exec;

	grunt.registerMultiTask('jekyll', 'This triggers the `jekyll` command.', function () {

		var done = this.async();
		var options = this.options();
		var command = 'jekyll';
		var optionList = {
			// Global Options
			'src': '--source',
			'dest': '--destination',
			'safe': '--safe',
			'plugins': '--plugins',
			'layouts': '--layouts',
			'profile': '--profile',
			'trace': '--trace',

			// Build Command Options
			'auto': '--watch',
			'watch': '--watch',
			'no_watch': '--no-watch',
			'config': '--config',
			'drafts': '--drafts',
			'future': '--future',
			'lsi': '--lsi',
			'limit_posts': '--limit_posts',
			'force_polling': '--force_polling',
			'verbose': '--verbose',
			'quiet': '--quiet',
			'incremental': '--incremental',

			// Serve Command Options
			'port': '--port',
			'server_port': '--port',
			'host': '--host',
			'baseurl': '--baseurl',
			'skip_initial_build': '--skip-initial-build',

			// Deprecated flags
			'paginate': false,
			'permalink': false,
			'markdown': false,
			'url': false
		};
		var majorVersion;
		var rawConfigFile;

		function testExists (next) {
			var versionCommand = options.bundleExec ? 'bundle exec jekyll -v' : 'jekyll -v';
			exec(versionCommand, function (error, stdout) {

				if (error) {
					grunt.log.error(error);
					grunt.fail.warn('Please install Jekyll before running this task.');
					done(false);
				}
				if (stdout) {
					// Stdout returns `jekyll 1.x.x`, match returns first semver digit
					majorVersion = stdout.match(/\d+/);
					next();
				}
			});
		}

		// Create temporary config file if needed
		function configContext (next) {
			if (options.raw) {
				// Tmp file is only available within the context of this function
				tmp.file({ prefix: '_config.', postfix: '.yml' }, function (err, path, fd) {

					rawConfigFile = path;

					if (err) {
						grunt.fail.warn(err);
					}

					// Write raw to file
					fs.writeSync(fd, new Buffer(options.raw), 0, options.raw.length);
					next();
				});
			}
			else {
				next();
			}
		}

		// Run configContext with command execution as a callback
		function runJekyll (next) {

			var cmd = command;
			var args = [];

			// Build the command string
			if (options.bundleExec) {
				cmd = 'bundle';
				args = ['exec', command];
			}

			if (options.serve) {
				args.push(majorVersion > 0 ? 'serve' : 'server');
			}
			else if (options.doctor) {
				args.push('doctor');
			}
			else {
				args.push('build');
			}

			// Insert temporary config path into the config option
			if (typeof rawConfigFile !== 'undefined') {
				options.config = options.config ? options.config + ',' + rawConfigFile : rawConfigFile;
			}

			// Add flags to command if running serve or build
			if (!options.doctor) {
				Object.keys(optionList).forEach(function (option) {
					if (options[option]) {
						args.push(optionList[option]);
						if (typeof options[option] !== 'boolean') {
							args.push(options[option]);
						}
						if (!options[option]) {
							grunt.warn('`' + option + '` has been deprecated. You may want to try this in the `raw` option in your gruntfile, or in a configuration file.');
						}
					}
				});
			}
			else {
				if (options.src) {
					args.push(optionList.src);
					args.push(options.src);
				}
			}

			// Execute command
			command = cmd + ' ' + args.join(' ');
			grunt.log.write('`' + command + '` was initiated.\n\n');

			if (options.serve) {
				grunt.log.write('Started Jekyll web server on http://localhost:' + (options.port || 4000) + '. Waiting...\n');
			}

			var child = grunt.util.spawn({cmd: cmd, args: args}, function (err) {
				if (err) {
					grunt.fail.warn(err);
					done(false);
				}
				else {
					next();
				}
			});
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
		}

		// Run the command
		testExists(function() {
			configContext (function() {
				runJekyll(function() {
					done(true);
				});
			});
		});
	});
};
