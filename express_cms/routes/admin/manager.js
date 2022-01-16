const express = require("express");
const router = express.Router();
const ManagerModel = require("../../model/managerModel");
const { md5,getUnix } = require("../../model/tools");

router.get("/", async (req, res) => {

    //Get administrator data
    let result = await ManagerModel.find({})

    res.render("admin/manager/index.html", {
        list: result
    })
})

router.get("/add", (req, res) => {

    res.render("admin/manager/add.html")
})
router.post("/doAdd", async (req, res) => {
    //1、Get the data submitted by the form
    var username = req.body.username;
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;
    //2、Verify whether the data is legal
    if (username == "") {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/manager/add",
            "message": "User name cannot be empty"
        })
        return;
    }
    if (password.length < 6) {
        res.render('admin/public/error', {
            message: 'Password length cannot be less than 6 digits',
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
    if (password != rpassword) {
        res.render('admin/public/error', {
            message: "The password and confirmation password are inconsistent",
            redirectUrl:  `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
     //3、Judge whether there is any data we want to add in the database
     let result = await ManagerModel.find({"username": username});
     if (result.length>0){
        res.render('admin/public/error', {
            message: "The current user already exists, please change another user",
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
     }else{
        //4、Perform the add operation
        var addResult=new ManagerModel({
            username,
            password:md5(password),
            email,
            mobile,
            status,
            addtime:getUnix()
        })

        await addResult.save()
        res.redirect(`/${req.app.locals.adminPath}/manager`)

     }

})



router.get("/edit", async (req, res) => {

    //Gets the ID of the data to be modified
    var id = req.query.id;
    var result = await ManagerModel.find({"_id":id});
    console.log(result);
    if (result.length>0){
        res.render("admin/manager/edit.html",{
            list:result[0]
        })
    }else{
        res.redirect("/admin/manager")
    }

})




router.post("/doEdit", async (req, res) => {
    
    var id = req.body.id;    
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;

    if (password.length>0){ //Change Password
        if (password.length < 6) {
            res.render('admin/public/error', {
                message: 'Password length cannot be less than 6 digits',
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        if (password != rpassword) {
            res.render('admin/public/error', {
                message: "The password and confirmation password are inconsistent",
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        await ManagerModel.updateOne({"_id":id},  {          
            "email": email,
            "mobile": mobile,
            "password":md5(password),
            "status":status
        })
       
    }else{  //Do not change the password, only change other information

        await ManagerModel.updateOne({"_id":id},  {          
            "email": email,
            "mobile": mobile,
            "status":status
        })
    }
    res.redirect(`/${req.app.locals.adminPath}/manager`)

})

router.get("/delete", async (req, res) => {    
    var id = req.query.id;
    var result = await ManagerModel.deleteOne({"_id":id});
    console.log(result)
    res.render('admin/public/success.html', {
        message: "Data deleted successfully",
        redirectUrl:`/${req.app.locals.adminPath}/manager`
    })
})

module.exports = router