const express = require("express");
const { UserModel } = require("../models/user.model");
const { redisClient } = require('../helpers/redis')
const userRouter = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


userRouter.post("/register",async(req,res)=>{
    const payload = req.body;
    try{

        const userExist = await UserModel.findOne({email:payload.email});
        if(userExist) {
            return res.status(400).send({"message":"User already Registered"});
        }

        bcrypt.hash(payload.password, 5, async(err, hash)=>{
            if(err)
            {
                console.log(err);
                return res.status(500).send({"error":"Something went wrong"});
            }

            payload.password = hash;
            const saveUser = new UserModel(payload);
            await saveUser.save();

            res.status(200).send({"message":"Successfully Registered"});
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({"error":"Something went wrong"});
    }
});

userRouter.post("/login",async(req,res)=>{
    const payload = req.body;
    try{

        const userExist = await UserModel.findOne({email:payload.email});
        if(!userExist) {
            return res.status(400).send({"message":"Please Register"});
        }

        bcrypt.compare(payload.password, userExist.password, async(err, result)=>{
            if(err)
            {
                console.log(err);
                return res.status(500).send({"error":"Something went wrong"});
            }

            if(!result) return res.status(400).send({"message":"Wrong Credentials"});

            const token = jwt.sign({userID:userExist._id},process.env.JWT_SECRET,{expiresIn: '1m'});

            res.cookie('token',token,{maxAge:1000*60} )

            res.status(200).send({"message":"Logged In"});
        });

    }
    catch(err){
        console.log(err);
        res.status(500).send({"error":"Something went wrong"});
    }
});

userRouter.get("/logout",async(req,res)=>{
    const token = req.cookies.token;
    if(!token) {
        return res.status(400).send({"message":"Please Login"});
    }

    try{

        await redisClient.set(token,1);
        await redisClient.expire(token,60*60*6);

        const isSaved = await redisClient.get(token);

        if(isSaved)
        {
           return res.status(200).json({message: "Logged Out"});
        }

        res.status(500).send({"error":"Something went wrong"});

    }
    catch(err){
        console.log(err);
        res.status(500).send({"error":"Something went wrong"});
    }
});

module.exports = {
    userRouter
}