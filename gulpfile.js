/*
 * @Author: KecanNi 
 * @Date: 2019-02-16 09:57:44 
 * @Last Modified by: KecanNi
 * @Last Modified time: 2019-02-18 08:01:31
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'), //编译scss
    autoprefixer = require('gulp-autoprefixer'), //自动添加前缀
    clean = require('gulp-clean-css'), //压缩css
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), //压缩js
    babel = require('gulp-babel'), //es6 ----> es5
    htmlmin = require('gulp-htmlmin'), //压缩html插件
    server = require('gulp-webserver'), //起服务
    rev = require('gulp-rev'), //给文件添加hash后缀
    collector = require('gulp-rev-collector'), //自动更改请求名
    imagemin = require('gulp-imagemin');


var fs = require('fs'),
    path = require('path'),
    url = require('url');

/* 开发环境 */

//编译css 
gulp.task('devSass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
})
//编译js
gulp.task('devJs', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./src/babel/'))
})
//监听
gulp.task('watch', function () {
    return gulp.watch(['./src/scss/**/*.scss', './src/babel/**/*.js'], gulp.series('devSass', 'devJs'))
})

//启服务
gulp.task('browserSync', function () {
    return gulp.src('src')
        .pipe(server({
            directoryListing: true,
            open: true,
            middleware: function (req, res, next) {
                var pathname = url.parse(req.url).pathname;
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
gulp.task('bHtml', function () {
    return gulp.src(['./rev/**/*.json','./src/**/*.html'])
        .pipe(htmlmin()) //压缩html
        .pipe(collector({
            replaceReved: true,
        }))
        .pipe(gulp.dest('./dist'))
})

//压缩css
gulp.task('bSass', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(clean()) //压缩css
        .pipe(gulp.dest('./dist/css/'))
})
rev
//压缩js
gulp.task('bJs', function () {
    return gulp.src('./src/babel/**/*.js')
        .pipe(rev()) //添加文件后缀
        .pipe(uglify()) //压缩js
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rev.manifest()) //创建mainifest.json
        .pipe(gulp.dest('./rev'))
})


//压缩img
gulp.task('bImg', function () {
    return gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
})

//压缩icon
gulp.task('bIcon', function () {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/font'))
})

//上线
gulp.task('bulid', gulp.series('bHtml', 'bSass', 'bJs', 'bImg', 'bIcon'))