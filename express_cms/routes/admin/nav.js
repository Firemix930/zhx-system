const express = require("express");
const { getUnix } = require("../../model/tools");
const NavModel = require("../../model/navModel");

var router = express.Router();
router.get("/", async (req, res) => {
    var result = await NavModel.find({})
    res.render("admin/nav/index.html", {
        list: result
    })
})
router.get("/add", (req, res) => {
    res.render("admin/nav/add.html")
})

router.post("/doAdd", async (req, res) => {
    try {
        var result = new NavModel(Object.assign(req.body, { add_time: getUnix() }))
        await result.save()
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav`,
            "message": "Data added successfully"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav/add`,
            "message": "Failed to add data"
        })
    }


})

router.get("/edit", async (req, res) => {
    var id = req.query.id;

    var result = await NavModel.find({ "_id": id })

    if (result.length > 0) {
        res.render("admin/nav/edit.html", {
            list: result[0]
        })
    } else {
        res.redirect(`/${req.app.locals.adminPath}/nav`)
    }

})

router.post("/doEdit", async (req, res) => {
    try {
        await NavModel.updateOne({ "_id": req.body.id }, req.body)
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav`,
            "message": "Data modified successfully"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav/edit?id=${ req.body.id}`,
            "message": "Failed to modify data"
        })
    }


})

router.get("/delete", async (req, res) => {
    var id = req.query.id;

    await NavModel.deleteOne({ "_id": id })

    res.render("admin/public/success.html", {
        "redirectUrl": `/${req.app.locals.adminPath}/nav`,
        "message": "Data deleted successfully"
    })

})


module.exports = router