import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"

import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRouter.js"
import { credentials } from "./config/credantials.js";
import { corsOptions } from "./config/cors.js";
import imagekitRouter from "./routes/imageKitRouter.js"
import messageRouter from "./routes/messageRouter.js"


dotenv.config();
const Port = process.env.PORT;
const server = express();
connectDB();

server.use(cookieParser());
server.use(express.json());
server.use(credentials);
server.use(cors(corsOptions));

server.get("/",(req,res)=>
{
    return res.status(200).json({message:"hello"})
})
server.use('/api/auth', authRouter);
server.use('/api/message', messageRouter)

server.use('/api/imagekit', imagekitRouter);

mongoose.connection.once('open', () => 
{
    server.listen(Port, ()=>
    {
        console.log("Server started at: " + Port)
    })
})
