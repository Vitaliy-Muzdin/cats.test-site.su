'use strict';
var httpSite = 'http://cats.test-site.su/',
    site = 'cats.test-site.su',
    gulp = require('gulp'),
    browserSync = require('browser-sync'),
    gulpUtil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    gulp_imagemin = require('gulp-imagemin'),
    gulp_pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    vinylFtp = require('vinyl-ftp'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('browser_sync', function() {
    browserSync.init({  // Выполняем browserSync
        proxy: httpSite, // проксирование вашего удаленного сервера, не важно на чем back-end
        //logPrefix: site, // префикс для лога browser_sync, маловажная настройка
        //host:      site, // можно использовать ip сервера
        port:      5000, // порт через который будет проксироваться сервер
        //open: 'external', // указываем, что наш url внешний
        notify:    false,  // Отключаем уведомления
        //ghost:     true,
    })
});

gulp.task('clean', function() {
    return del.sync('myTheme'); // Удаляем папку myTheme перед сборкой
});

gulp.task('clear', function() {
    return cache.clearAll();  // Очищаем кеш
});

gulp.task('gulp_sass', function() {
    return gulp.src('./app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }, { cascade: true }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./myTheme/css'))
        .pipe(conn.dest('/' + site + '/css'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('libraries_js', function() {
    return gulp.src([
        'app/js/jquery-3.3.1.min.js',
        'app/js/jquery.maskedinput.min.js',
        'app/js/bootstrap.min.js',
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./myTheme/js'))
        .pipe(conn.dest('/' + site + '/js'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('script', function() {
    return gulp.src('app/js/script.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./myTheme/js'))
        .pipe(conn.dest('/' + site + '/js'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('html', function() {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./myTheme'))
        .pipe(conn.dest('/' + site + '/'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function() {
    return gulp.src('./app/fonts/**/*')
        .pipe(gulp.dest('./myTheme/fonts'))
        .pipe(conn.dest('/' + site + '/fonts'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('php', function() {
    return gulp.src('./app/*.php')
        .pipe(gulp.dest('./myTheme/'))
        .pipe(conn.dest('/' + site + '/'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('css_directories', function() {
    return gulp.src('./app/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 10 version', 'safari 5', 'ie  6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }, { cascade: true }))
        .pipe(cssnano())
        .pipe(gulp.dest('./myTheme/css/'))
        .pipe(conn.dest('/' + site + '/css/'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('img', function() {
    return gulp.src('./app/images/**/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(cache(gulp_imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            //use: [pngquant()]
        })))
        .pipe(gulp.dest('./myTheme/images'))
        .pipe(conn.dest('/' + site + '/images'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('png', function() {
    return gulp.src('./app/*.png')
        .pipe(cache(gulp_imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            //use: [pngquant()]
        })))
        .pipe(gulp.dest('./myTheme/'))
        .pipe(conn.dest('/' + site + '/'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('watch', ['browser_sync', 'fonts', 'img', 'png'], function() {
    gulp.watch('./app/sass/**/*.sass', [ 'gulp_sass' ]);
    gulp.watch('./app/js/**/*.js', [ 'libraries_js' ]);
    gulp.watch('./app/js/script.js', [ 'script' ]);
    gulp.watch('./app/*.php', [ 'php' ]);
    gulp.watch('./app/css/*.css', [ 'css_directories' ]);
    gulp.watch('./app/*.html', [ 'html' ]);
});

// Файлы для копирования по ftp
var globs = [
    'myTheme/**/*.*'
];

// Конфигурация
var FTP_Configuration = require( './ftp.json' );
// Соединение с ftp
var conn = vinylFtp.create({
    host: FTP_Configuration.host,
    port: 21,
    user: FTP_Configuration.user,
    password: FTP_Configuration.password,
    parallel: 5
});

gulp.task('deploy', function () {
    return gulp.src(globs, {base: '.', buffer: false})
        .pipe(conn.dest('/' + site + '/'));
});
