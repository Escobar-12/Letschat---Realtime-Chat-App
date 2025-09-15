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
    const sockets = SocketMap[userId];
    return sockets ? [...sockets] : [];
}

io.on("connection", (socket) => {
    console.log("⚡ A user connected: " + socket.id);

    // update online users
    const user = socket.handshake.query.userId;
    if(user)
    {
        if (!SocketMap[user]) {
            SocketMap[user] = new Set();
        }
        SocketMap[user].add(socket.id);
        io.emit("updateOnlineUsers", Object.keys(SocketMap))
    } 
    // message
    socket.on("message", (msg) => {
        console.log("📩 Message received: " + msg);

        socket.broadcast.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected: " + socket.id);
        
        if (user && SocketMap[user]) 
        {
            SocketMap[user].delete(socket.id);

            if (SocketMap[user].size === 0) {
                delete SocketMap[user];
            }

            io.emit("updateOnlineUsers", Object.keys(SocketMap));
        }
    });
});


export default io;