const mongoose = require("./core")
let Schema = mongoose.Schema;
let ArticleSchema = mongoose.Schema({
    title: { type: String },
    link: { type: String },
    cid: {
        type: Schema.Types.ObjectId 
    },
    article_img: { type: String },
    description: { type: String },
    keywords: { type: String },
    content: { type: String },
    author: { type: String },
    click_count: { type: Number },   
    is_hot: {
        type: Number
    },
    is_best: {
        type: Number
    },    
    sort: {
        type: Number,
        default: 100
    },
    status: { type: Number, default: 1 },
    add_time: {
        type: Number
    }
})
module.exports = mongoose.model("Article", ArticleSchema, "article")