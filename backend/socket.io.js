import express from "express"
import http from "http"
import { Server } from "socket.io"
import { corsOptions } from "./config/cors.js";

import { userModel } from "./models/userModel.js";
import { conversationModel } from "./models/ConversationModel.js";

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

    socket.on('startTyping', async ({conversationId, typerId}) =>
    {
        if(!conversationId) return; 
        const conversation  = await conversationModel.findById(conversationId).populate("participants", "_id userName");
        if(!conversation) return;
        
        const typer = conversation.participants.filter( participant => participant._id.toString() === typerId.toString());
        if (!typer) return;
        const allOnlineParticipants = conversation.participants
            .filter(u => u._id.toString() !== typerId.toString())
            .flatMap(u => getSocketId(u._id))
            .filter(Boolean);

        if(!allOnlineParticipants.length) return;
        socket.to(...allOnlineParticipants).emit("isTyping", {conversationId, typer:typer[0].userName}) 
    })

    socket.on('stopTyping', async ({conversationId, typerId}) =>
    {
        if(!conversationId) return; 
        const conversation  = await conversationModel.findById(conversationId).populate("participants", "_id userName");
        if(!conversation) return;
        
        const typer = conversation.participants.filter( participant => participant._id.toString() === typerId.toString());
        if (!typer) return;
        const allOnlineParticipants = conversation.participants
            .filter(u => u._id.toString() !== typerId.toString())
            .map((user) => ( getSocketId(user._id) )).filter(Boolean);

        if(!allOnlineParticipants.length) return;
        socket.to(...allOnlineParticipants).emit("isStopedTyping", {conversationId, typer:typer[0].userName}) 
    })

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