const express = require("express");
const FocusModel = require("../../model/focusModel");
const NavModel = require("../../model/navModel");
const ManagerModel = require("../../model/managerModel");
const ArticleCateModel = require("../../model/articleCateModel");
const ArticleModel = require("../../model/articleModel");
//Configure all models
var appModel = {
    FocusModel: FocusModel,
    NavModel,
    ManagerModel,
    ArticleCateModel,
    ArticleModel
}
// appModel.FocusModel
// appModel["FocusModel"]  appModel["NavModel"]=NavModel

var router = express.Router()

router.get("/", (req, res) => {
    res.render("admin/main/index.html")
})
router.get("/welcome", (req, res) => {
    res.send("Welcome to the backstage management center")
})

router.get("/changeStatus", async (req, res) => {
    

    let id = req.query.id;
    let model = req.query.model + "Model";   //FocusModel NavModel Data model to operate on  the model name corresponding to the modified table Focus
    let field = req.query.field;   //Fields to modify   status   hot
    let json;  //Data to update
    var result = await appModel[model].find({ "_id": id });
    if (result.length > 0) {
        var tempField = result[0][field];
        tempField == 1 ? json = { [field]: 0 } : json = { [field]: 1 };  //Attribute name expression in ES6
        await appModel[model].updateOne({ "_id": id }, json);
        res.send({
            success: true,
            message: 'Status modified successfully'
        });
    } else {
        res.send({
            success: false,
            message: 'Failed to modify status'
        });
    }


})

router.get("/changeNum", async (req, res) => {
    try {
        let id = req.query.id;
        let model = req.query.model + "Model";   //FocusModel NavModel Data model to operate on  the model name corresponding to the modified table Focus
        let field = req.query.field;   //Fields to modify   status   hot
        let num = req.query.num;
        var result = await appModel[model].find({ "_id": id });
        if (result.length > 0) {
            let json = {
                [field]: num
            }
            await appModel[model].updateOne({ "_id": id }, json);
            res.send({
                success: true,
                message: 'Status modified successfully'
            });
        } else {
            res.send({
                success: false,
                message: 'Failed to modify quantity'
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: 'Failed to modify quantity'
        });
    }
})
module.exports = router