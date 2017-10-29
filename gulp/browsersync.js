/* BrowserSync task */

/**
 * plugins
 */
const gulp = require('gulp'),
  browserSync = require('browser-sync');


/**
 * configfile
 */
const config = require('./../config.js').browsersync;

/**
 * Tasks
 */
gulp.task('browsersync', ['scss'], function () {
  browserSync.init(config);
});
gulp.task('browsersyncReload', function () {
    browserSync.reload();
});