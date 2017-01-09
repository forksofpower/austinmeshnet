'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  assets = require('./config/assets/default'),
  // testAssets = require('./config/assets/test'),
  gulp = require('gulp'),
  // apidoc = require('gulp-apidoc'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path'),
  endOfLine = require('os').EOL;

// Set NODE_ENV to 'test'
// gulp.task('env:test', function () {
//   process.env.NODE_ENV = 'test';
// });

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
// gulp.task('env:prod', function () {
//   process.env.NODE_ENV = 'production';
// });

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(assets.server.views, assets.server.allJS, assets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();

  // Add watch rules
  gulp.watch(assets.server.views).on('change', plugins.livereload.changed);
  gulp.watch(assets.server.allJS, ['jshint', 'docs']).on('change', plugins.livereload.changed);
  gulp.watch(assets.client.js, ['jshint']).on('change', plugins.livereload.changed);
  gulp.watch(assets.client.css, ['csslint']).on('change', plugins.livereload.changed);
  
  if (process.env.NODE_ENV === 'production') {
    gulp.watch(assets.server.gulpConfig, ['templatecache', 'jshint']);
    gulp.watch(assets.client.views, ['templatecache', 'jshint']).on('change', plugins.livereload.changed);
  } else {
    gulp.watch(assets.server.gulpConfig, ['jshint']);
    gulp.watch(assets.client.views).on('change', plugins.livereload.changed);
  }
});

// CSS linting task
gulp.task('csslint', function (done) {
  return gulp.src(assets.client.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.reporter())
    .pipe(plugins.csslint.reporter(function (file) {
      if (!file.csslint.errorCount) {
        done();
      }
    }));
});

// JS linting task
gulp.task('jshint', function () {
  var assets = _.union(
    assets.server.gulpConfig,
    assets.server.allJS,
    assets.client.js,
  );

  return gulp.src(assets)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jshint.reporter('fail'));
});

// JS minifying task
gulp.task('uglify', function () {
  var assets = _.union(
    assets.client.js
  );

  return gulp.src(assets)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({
      mangle: false
    }))
    .pipe(plugins.concat('application.min.js'))
    .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
  return gulp.src(assets.client.css)
    .pipe(plugins.cssmin())
    .pipe(plugins.concat('application.min.css'))
    .pipe(gulp.dest('public/dist'));
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
  runSequence(['csslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
  runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
// gulp.task('test', function (done) {
//   runSequence('env:test', ['karma', 'mocha'], done);
// });
//
// gulp.task('test:server', function (done) {
//   runSequence('env:test', ['mocha'], done);
// });

// gulp.task('test:client', function (done) {
//   runSequence('env:test', ['karma'], done);
// });

// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', 'lint', 'docs', 'watch', ['nodemon'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev', 'lint', ['nodemon'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence('build', 'env:prod', 'lint',['nodemon'], done);
});
