const express = require("express");
const bodyParser = require('body-parser')
const session = require("express-session");
const ejs = require("ejs");
//引入配置文件
const config = require("./config/config")
//引入外部模块
const admin = require("./routes/admin")
const index = require("./routes/index")
const api = require("./routes/api")

const app = express()
//配置模板引擎
app.engine("html",ejs.__express)
app.set("view engine","html")
//配置静态web目录
app.use(express.static("static"))
//配置第三方中间件获取post提交的数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置session的中间件
app.use(session({
    secret: 'this is session', //服务器端生成 session 的签名
    name:"itying", //修改session对应cookie的名称
    resave: false, //强制保存 session 即使它并没有变化
    saveUninitialized: true, //强制将未初始化的 session 存储
    cookie: { 
        maxAge:1000*60*30,
        secure: false  // true 表示只有https协议才能访问cookie  
    },
    rolling:true  //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
}))


//Configure external routing module
app.use("/"+config.adminPath,admin)
app.use("/api",api)
app.use("/",index)

//Bind global template variables
app.locals.adminPath=config.adminPath;

//It is recommended to write the listening port number above 3000
app.listen(3000)