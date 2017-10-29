/* default task */

/**
 * Plugins
 */
const gulp = require('gulp');

/**
 * Tasks
 */
gulp.task('build', [
    'scss-build',
    'svg',
    'webpack:build'
]);
