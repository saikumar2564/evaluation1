const express = require("express");
const { CityModel } = require("../models/ipcity.model");
const { redisClient } = require('../helpers/redis')
const cityRouter = express.Router();
require("dotenv").config();
const { validator } = require("../middlewares/validator");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


cityRouter.get("/get/:ip",validator,async(req,res)=>{
    
    const ipAddress = req.params.ip || process.env.myIP;
    try{

        const cityCache = await redisClient.get(ipAddress);

        if(cityCache) return res.status(200).send({"currentLocation": cityCache});

        const cityApi = await fetch(`http://ip-api.com/json/${ipAddress}`).then(res => res.json()); 

        await CityModel.findOneAndUpdate({userID: req.body.userID},
            {userID: req.body.userID, $push:{ searches: cityApi }},
            {new:true, upsert:true, setDefaultsOnInsert:true}
        );

        await redisClient.set(ipAddress, cityApi.city);
        await redisClient.expire(ipAddress, 60*60*6);

        res.status(200).send({"currentLocation": cityApi.city});

    }
    catch(err){
        
        console.log(err);

        res.status(500).send({"error":"Something went wrong"});
    }
});

module.exports = {
    cityRouter
}