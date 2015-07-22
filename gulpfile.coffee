# Load all required libraries.
gulp = require "gulp"
gutil = require "gulp-util"
coffee = require "gulp-coffee"
istanbul = require "gulp-istanbul"
mocha = require "gulp-mocha"
plumber = require "gulp-plumber"
coveralls = require "gulp-coveralls"

gulp.on "err", ( e ) ->
	gutil.beep()
	gutil.log e.err.stack

gulp.task "coveralls", ->
	gulp.src "./coverage/**/lcov.info"
		.pipe coveralls()

gulp.task "coffee", ->
	gulp.src "./src/**/*.coffee"
		# Pevent pipe breaking caused by errors from gulp plugins
		.pipe plumber()
		.pipe coffee bare: true
		.pipe gulp.dest "./lib/"

gulp.task "test", [ "coffee" ], ->
	gulp.src [ "lib/**/*.js" ]
		# Covering files
		.pipe istanbul()
		# Overwrite require so it returns the covered files
		.pipe istanbul.hookRequire()
		.on "finish", ->
			gulp.src [ "test/**/*.spec.coffee" ]
				.pipe mocha reporter: "spec", compilers: "coffee:coffee-script"
				# Creating the reports after tests run
				.pipe istanbul.writeReports()

gulp.task "watch", ->
	gulp.watch "./src/**/*.coffee", [ "coffee" ]

gulp.task "default", [ "coffee" ]
