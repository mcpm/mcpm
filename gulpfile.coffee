# Load all required libraries.
gulp = require "gulp"
gutil = require "gulp-util"
coffee = require "gulp-coffee"
coffeelint = require "gulp-coffeelint"
istanbul = require "gulp-istanbul"
mocha = require "gulp-mocha"
insert = require "gulp-insert"
coveralls = require "gulp-coveralls"

gulp.on "err", ( e ) ->
	gutil.beep()
	gutil.log e.err.stack

gulp.task "coveralls", ->
	gulp.src "./coverage/**/lcov.info"
		.pipe coveralls()

gulp.task "coffee-src", ->
	gulp.src [ "src/**/*.coffee", "!src/bin{,/**/*}" ]
		.pipe coffeelint()
		.pipe coffeelint.reporter()
		.pipe coffeelint.reporter "fail"
		.pipe coffee bare: true
		.pipe gulp.dest "./lib/"

gulp.task "coffee-bin", ->
	gulp.src "src/bin/**/*.coffee"
		.pipe coffeelint()
		.pipe coffeelint.reporter()
		.pipe coffeelint.reporter "fail"
		.pipe coffee bare: true
		.pipe insert.prepend "#!/usr/bin/env node\n\n"
		.pipe gulp.dest "./bin/"

gulp.task "coffee", [ "coffee-src", "coffee-bin" ]

gulp.task "test", [ "coffee" ], ->
	gulp.src "lib/**/*.js"
		# Covering files
		.pipe istanbul()
		# Overwrite require so it returns the covered files
		.pipe istanbul.hookRequire()
		.on "finish", ->
			gulp.src "test/**/*.spec.coffee"
				.pipe mocha reporter: "spec", compilers: "coffee:coffee-script"
				# Creating the reports after tests run
				.pipe istanbul.writeReports()

gulp.task "watch", ->
	gulp.watch "./src/**/*.coffee", [ "coffee" ]

gulp.task "default", [ "coffee" ]
