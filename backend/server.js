import io, {app, server} from "./socket.io.js"
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

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(credentials);
app.use(cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter)

app.use('/api/imagekit', imagekitRouter);



mongoose.connection.once('open', () => 
{
    server.listen(Port, ()=>
    {
        console.log("Server started at: " + Port)
    })
})
