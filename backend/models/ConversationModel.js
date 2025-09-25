import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:{ 
    type : [{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"UserInfo",
        }], validate: [val => val.length >= 2, 'A conversation must have at least 2 participants']
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    isGroup: {
      type: Boolean,
      default: function () { return this.participants && this.participants.length > 2 },
    },
    groupName: {
      type: String,
      trim: true,
      deflate:"Group"
    },
    groupImage: {
      type: String,
      default:""
    },
},{timestamps:true});

conversationSchema.index({participants : 1});

export const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation",conversationSchema);