'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sh = require('shelljs'),
    inject = require('gulp-inject'),
    series = require('stream-series'),
    server = require('gulp-server-livereload');

var targetIndex = 'app/index.html';

var files = {
    css: {
        app: [
            'app/assets/app.css'
        ],
        vendor: [
            'app/vendor/**/*.css',
            'app/vendor/bootstrap/**/bootstrap.css',
            'app/vendor/admin-lte/**/*.css'
        ]
    },
    js: {
        app: [
            'app/app/init.js',
            'app/app/**/*.js'
        ],
        vendor: [
            'app/vendor/winstore-jscompat/*.js',
            'app/vendor/jquery/*.js',
            'app/vendor/angular-js/angular.js',
            'app/vendor/angular-translate/angular-translate.js',
            'app/vendor/three-js/three.js',
            'app/vendor/**/*.js'
        ]
    },
    // Don't include the following files at all
    noInclude: [
        '!app/cordova/**/*.*', // Don't inject cordova files
        '!app/nwjs/**/*.*', // Don't inject nw-js files
        '!app/**/*.min.*', // Don't inject minified files
        '!app/**/bootstrap-theme.css',
        '!app/**/skin-*.css' // Don't inject skin files from admin-lte
    ]
};

gulp.task('index:dev', function () {
    var target = gulp.src(targetIndex);

    var vendorCss = gulp.src([].concat(files.noInclude, files.css.vendor), {read: false});
    var appCss = gulp.src([].concat(files.noInclude, files.css.app), {read: false});

    var vendorJs = gulp.src([].concat(files.noInclude, files.js.vendor), {read: false});
    var appJs = gulp.src([].concat(files.noInclude, files.js.app), {read: false});

    return target.pipe(inject(series(vendorCss, appCss, vendorJs, appJs), {relative: true}))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['index:dev'], function () {
    gulp.watch([
        'app/**/*.js'
    ], ['index:dev']);
    gulp.src('app')
        .pipe(server({
            livereload: true,
            open: true
        }));
});
