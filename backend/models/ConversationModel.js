import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"UserInfo",
    }],
    lastMessage: {
        type:String,
        ref: "Message"
    },
},{timestamps:true});

export const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation",conversationSchema);