const mongoose =require("./core")

let ManagerSchema = mongoose.Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    mobile: { type: String },
    status: { type: Number, default: 1 },
    login_time: {
        type: Number
    },
    add_time: {
        type: Number
    }
})

module.exports=mongoose.model("Manager",ManagerSchema,"manager")