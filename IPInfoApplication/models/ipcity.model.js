require("dotenv").config();
const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    searches:[{
        type:Object,
        required:true
    }]
},{versionKey:false});

const CityModel = mongoose.model("City",citySchema);

module.exports = {
    CityModel
}