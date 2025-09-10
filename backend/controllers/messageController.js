import { conversationModel } from "../models/ConversationModel.js";
import { messageModel } from "../models/messageModel.js";

export const getChats = async (req, res) => {
    const user = req.user;

    try 
    {
        const conversations = await conversationModel
            .find({ participants: { $in: [user.id] } })
            .populate("participants") 
            .populate("lastMessage") 
            .sort({ updatedAt: -1 });

        if (!conversations || conversations.length === 0) 
        {
            return res.status(404).json({ success: false, message: "No conversations found" });
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
    console.log(chatId)
    console.log(user)
    const limit = 2;
    try
    {
        const query = { conversationId: chatId };

        const messages = await messageModel
            .find(query)
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


export const startNewChat = (req, res) =>
{
    const user = req.user;
    try
    {

    }
    catch (err) 
    {
        console.error("Error fetching chat:", err);
        return res.status(500).json({success: false, message: "Server error. Please try again later.",});
    }
} 