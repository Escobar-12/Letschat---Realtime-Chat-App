import express from "express"
import http from "http"
import { Server } from "socket.io"
import { corsOptions } from "./config/cors.js";



export const app = express();
export const server = http.createServer(app);

const io = new Server(server,
    {
        cors:corsOptions,
    }
) 

const SocketMap = {};

export const getSocketId = (userId) =>
{
    return SocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("⚡ A user connected: " + socket.id);

    // update online users
    const user = socket.handshake.query.userId;
    if(user)
    {
        SocketMap[user] = socket.id;
        io.emit("updateOnlineUsers", Object.keys(SocketMap))
    } 
    // message
    socket.on("message", (msg) => {
        console.log("📩 Message received: " + msg);

        socket.broadcast.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected: " + socket.id);
        delete SocketMap[user];
        io.emit("updateOnlineUsers", Object.keys(SocketMap))
    });
});


export default io;