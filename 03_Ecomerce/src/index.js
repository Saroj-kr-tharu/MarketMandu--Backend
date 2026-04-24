const express = require('express')
const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')
const {errorMw} = require("./middlewares/index")

const {PORT, REMINDER_BINDING_KEY}= require('./config/serverConfig')
const appRoutes = require('./Routes/index')
const { createChannel, subscribeMessage } = require('./utlis/messageQueue')
const { subscribeEvent } = require('./services/queue.service')

const serverSetupAndStart = async () => {
    const app = express()
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser());

    const channel = await createChannel(); 
    subscribeMessage(channel, subscribeEvent, REMINDER_BINDING_KEY);
    
    app.use("/api", appRoutes)

    app.use(errorMw);

    app.listen(PORT, async () => {
        console.log(` Ecommerce server start at ${PORT}`)
    })

}

serverSetupAndStart()