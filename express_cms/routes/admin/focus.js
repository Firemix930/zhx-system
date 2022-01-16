const express = require("express");
const { multer } = require("../../model/tools");
const FocusModel = require("../../model/focusModel");
const fs = require("fs");
var router = express.Router();
router.get("/", async (req, res) => {
    var result = await FocusModel.find({})
    res.render("admin/focus/index.html", {
        list: result
    })
})
router.get("/add", (req, res) => {
    res.render("admin/focus/add.html")
})

router.post("/doAdd", multer().single('focus_img'), async (req, res) => {
    var focus_img = req.file ? req.file.path.substr(7) : "";
    var result = new FocusModel(Object.assign(req.body, { "focus_img": focus_img }));
    await result.save();
    res.redirect(`/${req.app.locals.adminPath}/focus`);
})
router.get("/edit", async (req, res) => {

    var id = req.query.id;
    var result = await FocusModel.find({ "_id": id });
    res.render("admin/focus/edit.html", {
        list: result[0]
    })
})

router.post("/doEdit", multer().single('focus_img'), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        if (req.file) {  //Updated picture
            var focus_img = req.file ? req.file.path.substr(7) : "";
            await FocusModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { "focus_img": focus_img }))
        } else {
            await FocusModel.updateOne({ "_id": req.body.id }, req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/focus`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/focus/edit?id=${req.body.id}`,
            "message": "Failed to modify data"
        })
    }

})

router.get("/delete", async (req, res) => {
    var id = req.query.id;
    var resultList = await FocusModel.find({ "_id": id });
    var delResult = await FocusModel.deleteOne({ "_id": id });
    if (delResult.ok == 1 && delResult.n == 1) {
        if (resultList[0].focus_img) {
            fs.unlink("static/"+resultList[0].focus_img, (err) => {
                console.log(err);
            })
        }
    }
    res.render("admin/public/success.html", {
        "redirectUrl": `/${req.app.locals.adminPath}/focus`,
        "message": "Data deleted successfully"
    })

})


module.exports = router