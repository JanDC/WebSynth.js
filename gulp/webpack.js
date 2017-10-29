/* JS task */

/**
 * plugins
 */
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackConfig = require('./../webpack.common.js');
const webpackProdConfig = require('./../webpack.prod.js');

/**
 * Config file
 */
const config = require('./../config.js');

gulp.task('webpack:dev', function() {
    webpackConfig.devtool = 'eval-source-map';
    return gulp.src('')
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(config.js.dist));
});

gulp.task('webpack:build', function() {
    return gulp.src('')
        .pipe(plumber())
        .pipe(webpackStream(webpackProdConfig, webpack))
        .pipe(gulp.dest(config.js.dist));
});