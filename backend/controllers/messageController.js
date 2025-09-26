import mongoose, { Mongoose } from "mongoose";
import { conversationModel } from "../models/ConversationModel.js";
import { messageModel } from "../models/messageModel.js";
import io, {getSocketId } from "../socket.io.js"
import { userModel } from "../models/userModel.js";


export const getChats = async (req, res) => {
    const user = req.user;

    try 
    {
        const conversations = await conversationModel
            .find({ participants: { $in: [user.id] } })
            .populate({path:"participants",select:"-pwd -__v"}) 
            .populate("lastMessage") 
            .sort({ updatedAt: -1 });

        if (!conversations || conversations.length === 0) 
        {
            return res.status(200).json({ success: true, message: "No conversations found",formattedConversations:[] });
        }

        const formattedConversations = conversations.map((conv) => {
            return{
                ...conv.toObject(),
                participants:conv.participants.filter( (p) => p._id.toString() !== user.id.toString())
            }
        })

        return res.status(200).json({success: true,count: formattedConversations.length,formattedConversations ,});
    } 
    catch (err) 
    {
        console.error("Error fetching conversations:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
};

export const getChatMessages = async (req, res) =>
{
    const {chatId} = req.body;
    const user = req.user;
    const limit = 50;

    try
    {
        const query = { conversationId: chatId };

        const messages = await messageModel
            .find(query).populate("senderId", "userName _id profilePic")
            .sort({createdAt:-1})
            .limit(limit);


        return res.status(200).json({success: true,count: messages.length,chat:messages});
    }
    catch (err) 
    {
        console.error("Error fetching chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}


export const startNewChat = async (req, res) =>
{
    const user = req.user;
    const {reciever} = req.body;
    if (!reciever) return res.status(400).json({ success: false, message: "Missing reciever" });

    try
    {
        // check if reciever exists
        const recieverFound = await userModel.findById(reciever);
        if (!recieverFound) return res.status(400).json({ success: false, message: "Reciever not found" });
        
        // check if conversation already exists
        const conversationFound = await conversationModel.findOne({
            participants:{$all : [new mongoose.Types.ObjectId(user.id), recieverFound._id]},
            $expr: { $eq: [{ $size: "$participants" }, 2] } 
        })
        if(conversationFound) 
        {
            return res.status(200).json({success:false, message:"Conversation already exists"})
        }

        // create new conversation 
        const newConversation = await conversationModel.create({
            participants:[user.id, recieverFound._id],
        })

        const populatedNewConversation = await newConversation.populate({
            path:"participants",
            match: {_id: {$ne:user.id }},
            select:"-pwd -__v"
        })

        res.status(200).json({success: true, message: "Chat created successfuly", conversation:populatedNewConversation})
    }
    catch (err) 
    {
        console.error("Error fetching chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
} 

export const startNewGroup = async (req, res) =>
{
    const user = req.user;
    const {participants = [], groupName, groupImage} = req.body;
    if (!participants.length) return res.status(400).json({ success: false, message: "Missing participants" });
    try
    {
        // check if reciever exists
        const existingParticipants = await userModel.find({_id : {$in:participants}});
        if (existingParticipants.length !== participants.length) return res.status(400).json({ success: false, message: "Some participants are invalid or not found" });
        
        const allMembers = [...new Set([user.id, ...participants])];

        // check if group already exists with same members

        const conversationExists = await conversationModel.findOne({
            participants: {$all:allMembers},
            $expr: {$eq : [{ $size: "$participants" }, allMembers.length]}
        });

        if(conversationExists)
        {
            return res.status(400).json({ success: false, message: "Group already exists" });
        }

        // create new conversation 
        const newConversation = await conversationModel.create({
            participants:allMembers,
            isGroup:true,
            groupImage:groupImage||"",
            groupName:groupName||"Group"
        });

        const populatedNewConversation = await newConversation.populate("participants", "-pwd -__v");

        res.status(200).json({success: true, message: "Chat created successfuly", conversation:populatedNewConversation})
    }
    catch (err) 
    {
        console.error("Error fetching chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}

export const sendMessage = async (req, res) =>
{
    const user = req.user;
    const {text="", pic="", conversationId=""} = req.body;
    if(!conversationId) return res.status(400).json({ success: false, message: "Missing Conversation" });

    try
    {
        const message = await messageModel.create({
            senderId:user.id, 
            text, 
            image:pic, 
            conversationId,
            received:false,
            pending:true
        })

        const newMessage = await message.populate("senderId", "userName _id profilePic");

        console.log(newMessage)

        const conversation = await conversationModel.findById(conversationId).lean();
        if(!conversation) return res.status(400).json({ success: false, message: "Missing Conversation" });

        conversation.participants.forEach( reciever => {
            const recieverSocketId = getSocketId(reciever);
            if(recieverSocketId.length !== 0)
            {
                io.to(recieverSocketId).emit('newMessage', newMessage);
            }
        })

        res.status(201).json({ success: true, message: "Message sent successfully", newMessage });
    }
    catch (err) 
    {
        console.error("Error fetching message:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
} 

export const setTyping = async (req,res) =>
{
}

export const deleteMessage = async (req, res) =>
{
    const user = req.user;
    const {messageId} = req.body;
    try
    {
        await messageModel.findByIdAndDelete(messageId);
        res.status(201).json({ success: true, message: "Message deleted successfully" });
    }
    catch (err) 
    {
        console.error("Error deleting chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}


export const clearChat = async (req, res) =>
{
    const user = req.user;
    const {conversationId} = req.body;
    try
    {
        await messageModel.deleteMany({conversationId});
        res.status(201).json({ success: true, message: "Chat cleared successfully" });
    }
    catch (err) 
    {
        console.error("Error deleting chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}

export const deleteChat = async (req, res) =>
{
    const user = req.user;
    const {conversationId} = req.body;
    try
    {
        await conversationModel.findByIdAndDelete(conversationId);
        res.status(201).json({ success: true, message: "Chat deleted successfully" });
    }
    catch (err) 
    {
        console.error("Error deleting chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}

export const clearAllChat = async (req, res) =>
{
    const user = req.user;
    try
    {
        await messageModel.deleteMany({});
        res.status(201).json({ success: true, message: "Chats cleared successfully" });
    }
    catch (err) 
    {
        console.error("Error deleting chats:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}

export const deleteAllChat = async (req, res) =>
{
    const user = req.user;
    try
    {
        await conversationModel.deleteMany({});
        res.status(201).json({ success: true, message: "Chats deleted successfully" });
    }
    catch (err) 
    {
        console.error("Error deleting chats:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
}