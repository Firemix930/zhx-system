
const express = require("express");
const { getUnix } = require("../../model/tools");
const ArticleModel = require("../../model/articleModel");
const ArticleCateModel = require("../../model/articleCateModel");
const mongoose = require("../../model/core");

var router = express.Router();
router.get("/", async (req, res) => {
    var result = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid: "0"
            }
        }
    ])


    console.log(result)


    res.render("admin/articleCate/index.html", {
        list: result
    })
})
router.get("/add", async (req, res) => {
    //Get top-level classification
    var topCateList = await ArticleCateModel.find({ "pid": "0" });
    res.render("admin/articleCate/add.html", {
        cateList: topCateList
    })
})

router.post("/doAdd", async (req, res) => {
    //Get top-level classification  

    if (req.body.pid != "0") {
        req.body.pid = mongoose.Types.ObjectId(req.body.pid);
    }
    req.body.add_time = getUnix();
    var result = new ArticleCateModel(req.body)
    await result.save();
    res.redirect(`/${req.app.locals.adminPath}/articleCate`);

})

router.get("/edit", async (req, res) => {
    var id = req.query.id;
    var result = await ArticleCateModel.find({ "_id": id });
    console.log(result);
    //Get top-level classification 
    var topCateList = await ArticleCateModel.find({ "pid": "0" });
    res.render("admin/articleCate/edit.html", {
        list: result[0],
        cateList: topCateList
    })
})

router.post("/doEdit", async (req, res) => {
    try {
        if (req.body.pid != "0") {
            req.body.pid = mongoose.Types.ObjectId(req.body.pid);
        }
        await ArticleCateModel.updateOne({ "_id": req.body.id }, req.body);
        res.redirect(`/${req.app.locals.adminPath}/articleCate`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
            "message": "Failed to add data"
        })
    }
})
router.get("/delete", async (req, res) => {
    var id = req.query.id;
    var subReuslt = await ArticleCateModel.find({ "pid": mongoose.Types.ObjectId(id) });
    if (subReuslt.length > 0) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
            "message": "The current category cannot be deleted. Please delete the following subcategories and try again"
        })
    } else {

        var subArticelReuslt = await ArticleModel.find({ "cid": mongoose.Types.ObjectId(id) });
        if (subArticelReuslt.length > 0) {
            res.render("admin/public/error.html", {
                "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
                "message": "The article information under the current category cannot be deleted. Delete the article and try again"
            })
        } else {
            await ArticleCateModel.deleteOne({ "_id": id });
            res.render("admin/public/success.html", {
                "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
                "message": "Data deleted successfully"
            })
        }

    }


})


module.exports = router