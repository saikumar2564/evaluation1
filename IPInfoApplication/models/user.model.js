require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
},{versionKey:false});

const UserModel = mongoose.model("User",userSchema);

module.exports = {
    UserModel
}