/*
 * @Author: KecanNi 
 * @Date: 2019-02-16 09:57:44 
 * @Last Modified by: KecanNi
 * @Last Modified time: 2019-02-16 10:46:23
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'), //编译scss
    autoprefixer = require('gulp-autoprefixer'), //自动添加前缀
    clean = require('gulp-clean-css'), //压缩css
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), //压缩js
    babel = require('gulp-babel'), //es6 ----> es5
    htmlmin = require('gulp-htmlmin'), //压缩html插件
    server = require('gulp-webserver'); //起服务

var fs = require('fs'),
    path = require('path'),
    url = require('url');

/* 开发环境 */

//编译css 
gulp.task('devSass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
})

//监听
gulp.task('watch', function() {
    return gulp.watch('./src/scss/**/*.scss', gulp.series('devSass'))
})

//启服务
gulp.task('browserSync', function() {
    return gulp.src('src')
        .pipe(server({
            directoryListing: true,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname)
                if (pathname === '/favicon.ico') {
                    return res.end('')

                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }

            }
        }));
})


//默认执行
gulp.task('default', gulp.parallel('devSass', 'devJs', 'browserSync', 'watch'))


/* *******************************分割线********************************** */

/* 线上环境 */

//压缩html
gulp.task('bHtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('./dist'))
})

//压缩css
gulp.task('bSass', function() {
    return gulp.src('./src/css/**/*.css')
        .pipe(clean()) //压缩css
        .pipe(gulp.dest('./dist/css/'))
})

//压缩js
gulp.task('bJs', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify()) //压缩js
        .pipe(gulp.dest('./dist/js/'))
})

//压缩img
gulp.task('bImg', function() {
    return gulp.src('./src/images/*')
        .pipe(gulp.dest('./dist/images'))
})

//压缩icon
gulp.task('bIcon', function() {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/font'))
})

//上线
gulp.task('bulid', gulp.series('bHtml', 'bSass', 'bJs', 'bImg', 'bIcon'))