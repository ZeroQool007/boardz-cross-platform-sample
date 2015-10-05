'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sh = require('shelljs'),
    NwBuilder = require('nw-builder'),
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

gulp.task('clean:cordova', function (done) {
    del(['app/cordova/www', 'app/cordova/platforms', 'app/cordova/plugins'])
        .then(function () {
            done();
        });
});

gulp.task('clean:nwjs', function (done) {
    del(['app/nwjs/www', 'app/nwjs/build'])
        .then(function () {
            done();
        });
});

gulp.task('copy-source', ['clean:cordova', 'clean:nwjs'], function () {
    return gulp.src([
        'app/**/*.*',
        '!app/cordova/**/*.*',
        '!app/nwjs/**/*.*'
    ])
        .pipe(gulp.dest('app/cordova/www'))
        .pipe(gulp.dest('app/nwjs/www'));
});

gulp.task('build:cordova', ['clean:cordova', 'copy-source'], function (done) {
    sh.cd('app/cordova');
    sh.exec('cordova platform add ios');
    sh.exec('cordova platform add android');
    sh.exec('cordova platform add windows');
    sh.exec('cordova plugin add org.apache.cordova.statusbar');
    sh.exec('cordova plugin add cordova-plugin-geolocation');
    sh.exec('cordova plugin add cordova-plugin-camera');
    sh.exec('cp -r ../resources .');
    sh.exec('ionic resources');
    sh.exec('cordova build');
    done();
});

gulp.task('build:nwjs', ['clean:nwjs', 'copy-source'], function () {
    var nw = new NwBuilder({
        version: '0.12.3',
        files: './app/nwjs/**/**',
        buildDir: "./app/nwjs/build",
        //winIco: "./app/resources/icon.png",
        macIcns: "./app/resources/icon.icns",
        platforms: ['win32', 'win64', 'osx64', 'linux32', 'linux64']
    });

    return nw.build();
});

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

//gulp.task('default', ['clean', 'copy-source', 'build:cordova']);