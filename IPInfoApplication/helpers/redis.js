const Redis = require('ioredis');
require("dotenv").config();

const redisClient = new Redis(process.env.redisURL);

redisClient.on("connect",()=>{
    console.log("Connected to Redis");
});


redisClient.on("err",(err)=>{
    console.log(err);
});

module.exports = {
    redisClient
}