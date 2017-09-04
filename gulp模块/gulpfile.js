var gulp = require("gulp");
var browserify = require("browserify");//获取入口文件
var source = require("vinyl-source-stream");//合并js参数为新模块的名字
var buffer = require("vinyl-buffer");//把node的流转为gulp流
var rev = require("gulp-rev");//生成md5后缀（且可以生成对应关系）
var collector = require("gulp-rev-collector");//可以配合做出替换index中script的src的内容
var connect = require("gulp-connect");//做出前端启动服务
var webserver = require("gulp-webserver");//做出后端服务接口
var watch = require("gulp-watch");//做出事件监听

//实现js合并
gulp.task("module",function(){
    browserify({
        entries:["./entry.js"]
    }).bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        //实现md5后缀
        .pipe(rev())
        .pipe(gulp.dest("./"))
        //生成对应关系
        .pipe(rev.manifest())
        .pipe(gulp.dest("./"));
    //注意需要将内容二次放入文件夹 因为是两个不同的文件

});

//做出版本管理   标识打包生成的js版 自动替换到网页上
gulp.task("srcReload",function(){
    //为了解决bug 就是当上面的module模块没有执行完毕的时候就会异步执行下一个srcReload模块
    //需要将本模块的内内容延迟执行
    setTimeout(function(){
        gulp.src(["./index.html","rev-manifest.json"])
            .pipe(collector({
                replaceReved:true
            }))
            .pipe(gulp.dest("./"))
    },300);

});
//启动服务后 热更新
gulp.task("reloadPage",function(){
    gulp.src(".")
        .pipe(connect.reload())
});
gulp.task("watch",function(){
    //监听后需要将模块进行再次监听再次md5添加后缀 然后进行热更新 反复进行
    gulp.watch(["./module1.js","./module2.js"],["module","srcReload"]);
    //二次监听 监听的是index.html 为了看是否第一次监听的module内容进行变动后是否index.html里面的src自动变化了
    //变化了就实现了第一次监听的回调函数 就可以达到重复监听的目地了
    gulp.watch(["./index.html"],["module","reloadPage"])
});
//重新启动服务
gulp.task("httpServer",function(){
    connect.server({
        port:8080,
        livereload:true
    })
});

//开启了服务需要将模块进行第一次开启 随后进行监听
gulp.task("default",["httpServer","module","watch"]);












