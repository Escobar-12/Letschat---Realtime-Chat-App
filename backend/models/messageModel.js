import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Conversation",
    },
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"UserInfo",
    },
    text: {
        type:String,
    },
    image: {
        type:String,
    },
},{timestamps:true});

export const messageModel = mongoose.models.Message || mongoose.model("Message",messageSchema);