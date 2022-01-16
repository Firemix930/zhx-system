const express = require("express");
const svgCaptcha = require('svg-captcha');
const ManagerModel = require("../../model/managerModel");

const { md5 } = require("../../model/tools");

var router = express.Router()

router.get("/", async (req, res) => {
    res.render("admin/login/login.html")
})
router.post("/doLogin", async (req, res) => {

    let username = req.body.username
    let password = req.body.password
    let verify = req.body.verify
    // 1、Determine whether the verification code is correct  
    if (verify.toLocaleLowerCase() != req.session.captcha.toLocaleLowerCase()) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/login`,
            "message": "Graphic verification code input error"
        })
        return
    }
    // 2、Judge whether the user name and password are legal
    let result = await ManagerModel.find({ "username": username, "password": md5(password) });
    if (result.length > 0) {
        //Save user information
        req.session.userinfo = result[0]
        //Prompt login success
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}`,
            "message": "Login succeeded"
        })
    } else {
        res.render("admin/public/error.html", {
            "redirectUrl":`/${req.app.locals.adminPath}/login`,
            "message": "Wrong user name or password"
        })
    }


})


router.get('/verify', function (req, res) {
    var captcha = svgCaptcha.create();
    // Save verification code
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

router.get('/loginOut', function (req, res) {
    req.session.userinfo = null;
    res.redirect(`/${req.app.locals.adminPath}/login`)
});


module.exports = router