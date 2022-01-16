const express = require("express");
const { multer } = require("../../model/tools");
const SettingModel = require("../../model/settingModel");
const settingModel = require("../../model/settingModel");
var router = express.Router();

router.get("/", async (req, res) => {
    var result = await SettingModel.find({})
    res.render("admin/setting/index.html", {
        list: result[0]
    })
})

var cpUpload = multer().fields([{ name: 'site_logo', maxCount: 1 }, { name: 'no_picture', maxCount: 1 }])
router.post("/doEdit",cpUpload, async (req, res) => {
    var json={}
    if(req.files.site_logo){
        let site_logo=req.files.site_logo[0].path.substr(7);
        json=Object.assign(json,{"site_logo":site_logo});
    }
    if(req.files.no_picture){
        let no_picture=req.files.no_picture[0].path.substr(7);
        json=Object.assign(json,{"no_picture":no_picture});   
    }       
    await settingModel.updateMany({},Object.assign(json,req.body));    
   
    res.render('admin/public/success.html', {
        message: "Data modified successfully",
        redirectUrl:`/${req.app.locals.adminPath}/setting`
    })

})


module.exports = router