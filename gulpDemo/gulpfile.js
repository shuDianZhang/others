/**
 * Created by lenovo on 2017/4/5.
 */
const gulp         = require('gulp');
const sourcemaps   = require('gulp-sourcemaps');
const browserify   = require('browserify');
const babelify     = require('babelify');
const source       = require('vinyl-source-stream');
const buffer       = require('vinyl-buffer');
const clean        = require('gulp-clean');
const livereload   = require('gulp-livereload');
const uglify       = require('gulp-uglify');
const eslint       = require('gulp-eslint');
const rev          = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const minifyHTML   = require('gulp-minify-html');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const glob         = require('glob');
const es           = require('event-stream');
const nodemon      = require('gulp-nodemon');
const gulpsync     = require('gulp-sync')(gulp);
const imagemin     = require('gulp-imagemin');
const runSequence  = require("run-sequence").use(gulp);
const browserSync  = require("browser-sync").create();
const syncftp      = require("./syncftp");
const gutil        = require('gulp-util');

const OUTPUTDIR    = "./public/output";
const BINDIR       = "./public/bin";
const TRANSFER     = "./public/transfer";
const IMGDIR       = "./src/image";

let isPro = false;
let isFresh = false;

//exit
gulp.task('exit', (cb) => {
    cb();
    process.exit(0);
});

//删除整个bin文件夹
gulp.task('clean', () => {
    return gulp.src([
        BINDIR, OUTPUTDIR, TRANSFER, "view"
    ]).pipe(clean({force: true}));
});

//监控
let timer = null;
gulp.task('watch', () => {
    return gulp.watch([
        './src/**/*',
        './template/**/*'
    ], ()=>{
        clearTimeout(timer);
        timer = setTimeout(function () {
            gulp.run('default');
        }, 3e3);
    }).on('change', function(event) {
        gutil.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

//刷新浏览器
gulp.task("browser", ()=>{
    return browserSync.init({
        //server: {
        //    baseDir: "./"
        //},
        proxy: "localhost:4410",
        port: 4413,
        open: true,
        notify: true,
        reloadDelay: 400
    });
});
gulp.task("re-browser", ()=>{
    return browserSync.reload()
});


//----------------sync img------------------
gulp.task('sync', (cb)=>{
    return syncftp(cb)
});
//------------------end------------------

//---------------add hash------------------
//add css hash
gulp.task('css', function () {
    return isPro?
    gulp.src(`${OUTPUTDIR}/css/*.css`)
    .pipe(rev())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(`${TRANSFER}/css`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/css`))
    :
    gulp.src(`${OUTPUTDIR}/css/*.css`)
    .pipe(rev())
    .pipe(gulp.dest(`${TRANSFER}/css`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/css`));
});

//add js hash
gulp.task('scripts', function () {
    return isPro?
    gulp.src(`${OUTPUTDIR}/js/*.js`)
    .pipe(rev())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(`${TRANSFER}/js`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/js`))
    :
    gulp.src(`${OUTPUTDIR}/js/*.js`)
    .pipe(rev())
    .pipe(gulp.dest(`${TRANSFER}/js`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/js`));
});

//add image hash
gulp.task('image', ['sync'], function () {
    return isPro?
    gulp.src(`${IMGDIR}/**/*.*`)
    .pipe(rev())
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(`${BINDIR}/image`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/image`))
    :
    gulp.src(`${IMGDIR}/**/*.*`)
    .pipe(rev())
    .pipe(gulp.dest(`${BINDIR}/image`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${TRANSFER}/rev/image`))

});
//------------------end------------------


//---------------rev------------------

//替换pug内js、css、img引用
gulp.task('rev-pug', ['scripts', 'css', 'image'], () => {
    return gulp.src([`${TRANSFER}/rev/**/*.json`, 'template/**/*.pug'])
    .pipe(revCollector({
        replaceReved: true,
        dirReplacements: {
            // isPro == true 预留做CDN路由
            'yyportal:css/': isPro? '/bin/css/': '/bin/css/',
            'yyportal:js/': isPro? '/bin/js/': '/bin/js/',
            'yyportal:img/': isPro? '/bin/image/': '/bin/image/',
            'yyportal:cdn/': function (manifest_value) {
                return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'yyfax.dot' + '/img/' + manifest_value;
            }
        },
        revSuffix :isPro? '-[0-9a-f]{8,10}.min?': '-[0-9a-f]{8,10}-?'
    }))
    //.pipe( minifyHTML({
    //    empty:true,
    //    spare:true
    //}) )
    .pipe(gulp.dest('view'));
});

//替换css内image引用
gulp.task('rev-css', ['image', 'css'], () => {
    return gulp.src([`${TRANSFER}/rev/image/rev-manifest.json`, `${TRANSFER}/css/*.css`])
    .pipe(revCollector({
        replaceReved: true,
        dirReplacements: {
            'yyportal:img/': isPro? '/bin/image/': '/bin/image/',
        },
        revSuffix :isPro? '-[0-9a-f]{8,10}.min?': '-[0-9a-f]{8,10}-?'
    }))
    .pipe(gulp.dest(`${BINDIR}/css`));
});

//替换js内image引用
gulp.task('rev-js', ['image', 'scripts'], () => {
    return gulp.src([`${TRANSFER}/rev/image/rev-manifest.json`, `${TRANSFER}/js/*.js`])
    .pipe(revCollector({
        replaceReved: true,
        dirReplacements: {
            'yyportal:img/': isPro? '/bin/image/': '/bin/image/',
        },
        revSuffix :isPro? '-[0-9a-f]{8,10}.min?': '-[0-9a-f]{8,10}-?'
    }))
    .pipe(gulp.dest(`${BINDIR}/js`));
});

gulp.task('rev', ['rev-pug', 'rev-css', 'rev-js'], () => {
    gutil.log("------------------------------------------------");
    gutil.log("----------rev contribute success!!!-------------");
    gutil.log("------------------------------------------------");
    return gulp.src([
        OUTPUTDIR, TRANSFER
    ]).pipe(clean())
});
//------------------end------------------


//------------------build------------------

//sass
gulp.task('sass', function () {
    return isPro ?
        gulp.src('./src/style/**/*.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        //.pipe(sourcemaps.write())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(`${OUTPUTDIR}/css`))
        :
        gulp.src('./src/style/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(`${OUTPUTDIR}/css`));
});


//eslint
gulp.task('eslint', () => {
    return gulp.src(['./src/engine/*.js', '!node_modules/**'])  //获取src目录内全部js文件
    .pipe(eslint({  //此处eslint的各配置项格式与.eslintrc文件相同
        "rules": {
            "camelcase": [2, {"properties": "always"}],
            "comma-dangle": [2, "never"],
            "semi": [0, "always"],
            "quotes": [0, "single"],
            "strict": [2, "global"]
        },
        "parser": "babel-eslint"
    }))
    .pipe(eslint.format());
    //.pipe(eslint.failAfterError());
});

//构建开发engine脚本
gulp.task('es6', ['eslint'], (done) => {
    return isPro ?
        glob('./src/engine/*.js', (err, files) => {
            if (err) done(err);
            let tasks = files.map((entry) => {
                return browserify({entries: entry, debug: false})
                .transform(babelify, {presets: ['es2015', 'stage-0']})
                .bundle()
                .pipe(source(entry.substr(entry.lastIndexOf("/") + 1)))
                .pipe(buffer())
                //.pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify({
                    mangle: false,//类型：Boolean 默认：true 是否修改变量名
                    compress: true,//类型：Boolean 默认：true 是否完全压缩
                }))
                //.pipe(sourcemaps.write('.'))
                //.pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest(`${OUTPUTDIR}/js`))
                .on('error', function (err) {
                    gutil.log("---------------------error----------------------");
                    gutil.log(err);
                    gutil.log("------------------------------------------------");
                });
            });
            es.merge(tasks).on('end', done);
        }):
        glob('./src/engine/*.js', (err, files) => {
            if (err) done(err);
            let tasks = files.map((entry) => {
                return browserify({entries: entry, debug: true})
                .transform(babelify, {presets: ['es2015', 'stage-0']})
                .bundle()
                .pipe(source(entry.substr(entry.lastIndexOf("/") + 1)))
                .pipe(gulp.dest(`${OUTPUTDIR}/js`))
                .pipe(livereload());
            });
            es.merge(tasks).on('end', done);
        });
});
//------------------end------------------

//构建
gulp.task('construct', ["es6", "sass"], () => {
    gutil.log("------------------------------------------------");
    isPro ? gutil.log("----------pro contribute success!!!-------------"): gutil.log("----------dev contribute success!!!-------------");
    gutil.log("------------------------------------------------");
});

//开发环境，监视文件改动
gulp.task('dev', ()=>{
    isPro = false;
    return runSequence('clean', 'construct', 'rev', 'watch', 'browser');
});

//生产环境，含压缩
gulp.task('build', ()=>{
    isPro = true;
    return runSequence('clean', 'construct', 'rev', 'exit');
});

gulp.task('default', ()=>{
    return runSequence('clean', 'construct', 'rev', 're-browser');
});

//启动task
let nodeProcess = null;
gulp.task("run", ["dev"], (cb) => {
    let called = false;
    if (!called) {
        nodeProcess = nodemon({})
        .on("restart", () => {
        }).on("start", () => {
            if (!called) {
                called = true;
                cb()
            }
        })
    } else {
        nodeProcess.emit("restart");
        cb();
    }
    return nodeProcess;
});