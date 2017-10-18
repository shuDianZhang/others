//  导入模块 node_modules对应的模块
var gulp = require('gulp')
var less = require('gulp-less');
var rename = require('gulp-rename')
var uglify= require("gulp-uglify");        
var uglify = require("gulp-uglify");



gulp.task('testLess', function () {

    gulp.src('src/less/index.less')     //该任务针对的文件

        .pipe(less())                   //该任务调用的模块

        .pipe(gulp.dest('src/css'));     //将会在src/css下生成index.css

});

gulp.task("default", ["watch"], function () { //定义默认任务 并让gulp监视文件变化自动执行

    gulp.watch("sass/*.scss", ["sass"]);

})

// js代码压缩
gulp.task('rename', function () {

    gulp.src('src/**/*.js')

        .pipe(uglify())//压缩

        .pipe(rename('index.min.js'))

        .pipe(gulp.dest('build/js'));

});
gulp.task('default', ['rename']);