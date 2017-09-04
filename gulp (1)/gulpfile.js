var gulp = require("gulp");
var webserver = require("gulp-webserver");
var connect = require("gulp-connect");
var urlTool = require("url");
var qsTool = require("querystringify");

//mock一份后台数据
var paramsArray = [
    {"username":"zhangsan","password":123456},
    {"username":"lisi","password":234567}
];
gulp.task("mockserver",function(){
    gulp.src(".")
        .pipe(webserver({
            port: 8080,
            middleware:function(req,res,next){
                //解决跨域问题
                res.setHeader('Access-Control-Allow-Origin','*');
                //找到内容 解析地址栏参数
                var urlString = req.url;
                var method = req.method;
                //将得到的url字符串变成对象
                var urlObj = urlTool.parse(urlString);
                //将地址和参数分开
                var pathname = urlObj.pathname;
                var getParamsString = urlObj.query;
                //将字符串参数变成对象
                var getParamsObj = qsTool.parse(getParamsString);

                //判断方式执行不同商品操作
                if(method === "GET"){
                    //只能执行商品也等的操作
                    //判断参数执行什么样的商品页操作
                    switch(pathname){
                        case "/goodslist":
                            res.setHeader("content-type","application/json;charset=utf-8");
                            res.write('{"你的商品列表":"商品信息"}');
                            res.end("没有找到所需要的内容");
                        break;
                        case "/home":

                        break;
                        default :
                        res.end("没有找到所需要的内容");
                    }
                }else if(method === "POST"){
                    //将post过来的参数进行数据拼接
                    var paramsStr = "";
                    req.on("data",function(chunk){
                        paramsStr += chunk;
                        console.log(paramsStr);
                    });
                    req.on("end",function(){
                        console.log(paramsStr);
                        var postParams;
                        if(paramsStr.indexOf("{") != -1 && paramsStr.indexOf("}") != -1){
                            postParams = JSON.parse(paramsStr);
                        }else{
                            postParams = qsTool.parse(paramsStr);
                        }
                        //执行登录注册页的操作
                        switch(pathname){
                            case "/login":
                                for(var i=0; i<paramsArray.length; i++){
                                    if(paramsArray[i].username == postParams.username && paramsArray[i].password == postParams.password){
                                        res.setHeader("content-type","application.json;charset=uft-8");
                                        res.end("完成登录");
                                        break;
                                    }
                                }
                                break;
                            case "/register":
                                res.end("登录或者注册失败");
                                break;
                            default :
                                res.end("登录或者注册失败");
                        }
                    });
                }
            }
        }))
});
gulp.task("connect",function(){
    connect.server({
        port:3000,
        livereload:true
    })
});
gulp.task("default",["mockserver","connect"]);//需要先起服务在进行前台请求 为了避免当前台请求之后后台服务没有开始 会出现bug





/*var postParamsStr = "";
req.on("data",function(chunk){
    postParamsStr += chunk;
});
req.on("end",function(){
    console.log(postParamsStr);
    //数据
        //表单形式
        //json形式
    var postParams;
    //需要拿到的数据全部是对象形式
    if(postParamsStr.indexOf("{") != -1 && postParamsStr.indexOf("}") != -1){
        postParams = JSON.parse(postParamsStr);
    }else{
        postParams = qs.parse(postParamsStr);
    }


});*/







