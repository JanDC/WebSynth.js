/* Watch task */

/**
 * plugins
 */
const gulp = require('gulp');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

/**
 * configs
 */
const config = require('./../config.js');

/**
 * Tasks
 */
gulp.task('watch', ['build', 'browsersync'], function () {
     watch(config.files, function () {
        gulp.start('browsersyncReload');
    });
    watch(config.js.glob, function () {
        runSequence('webpack:dev', 'browsersyncReload');
    });
});
