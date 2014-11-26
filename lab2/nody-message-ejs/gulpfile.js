'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// img
var imagemin = require('gulp-imagemin');
var optipng = require('imagemin-optipng');
var jpegtran = require('imagemin-jpegtran');
var svgo = require('imagemin-svgo');

// File paths
var paths = {
    original_img: './frontend/src/img/**/*.*',
    minified_img: './public/img',
    script_dist: './public/js',
    script_src: './frontend/src/js/**/*.js'
};

gulp.task('img', function () {
    return gulp.src(paths.original_img)
        .pipe(imagemin ({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [optipng(), jpegtran(), svgo()]
        }))
        .pipe(gulp.dest(paths.minified_img));
});

gulp.task('scripts', function () {
    return gulp.src(paths.script_src)
        .pipe(concat('jsbundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.script_dist));
});

gulp.task('watch', function () {
    gulp.watch(paths.original_img + '/**/*.*', ['img']);
    gulp.watch(paths.script_src, ['scripts']);
});

gulp.task('default', ['img', 'scripts', 'watch']);
