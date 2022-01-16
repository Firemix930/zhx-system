const mongoose =require("./core")

let SettingSchema = mongoose.Schema({
    site_title: { type: String },
    site_logo: { type: String },
    site_keywords: {
      type: String
    },
    site_description: {
      type: String
    },
    no_picture: {
      type: String
    },
    site_icp: {
      type: String
    },
    site_tel: {
      type: String
    },
    search_keywords: {
      type: String
    },
    tongji_code: {
      type: String
    }
})
module.exports=mongoose.model("Setting",SettingSchema,"setting")