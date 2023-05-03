const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.router");
const { redisClient } = require('./helpers/redis');
const { authentication } = require("./middlewares/authentication.middleware");
const { cityRouter } = require("./routes/ipcity.router");
const { logger } = require("./middlewares/logger.middleware");

const app = express();

require("dotenv").config();

app.use(require('cookie-parser')());

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Server Working...")
});

app.use("/user", userRouter);

app.use(authentication);


app.use("/city",cityRouter);

app.get("/protected", (req, res) => {

    res.status(200).send("Protected accessed...")
    
});








app.listen(1230, async () => {
    try {
        await connection;
        logger.log("info","Database connected")
        console.log('Connected to DB')
    } catch (error) {
        console.log(error)
    }
    console.log('Server is running at the port: 1230')
});