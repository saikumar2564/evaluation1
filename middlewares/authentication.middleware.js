const { UserModel } = require("../models/user.model");
const { redisClient } = require('../helpers/redis')
require("dotenv").config();
const jwt = require('jsonwebtoken');

const authentication = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(400).send({"message":"Please Login"});
    try{

        const blockedToken = await redisClient.get(token);
        if(blockedToken) return res.status(400).send({"message":"Please Login"});

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err)
            {
                console.log(err);
                return res.status(500).send({"error":"Something went wrong"});
            }

            req.body.userID = decoded.userID;
            next();
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({"error":"Something went wrong"});
    }
}

module.exports = {
    authentication
}