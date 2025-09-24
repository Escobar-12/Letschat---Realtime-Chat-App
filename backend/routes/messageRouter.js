import { Router } from "express";

import { getChats,getChatMessages,startNewChat, sendMessage, clearChat, deleteChat, deleteMessage, deleteAllChat, clearAllChat, setTyping } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.get('/chats', verifyAccess, getChats);
router.post('/chat', verifyAccess, getChatMessages);
router.post('/send', verifyAccess, sendMessage);
router.post('/typing', verifyAccess, setTyping);
router.post('/newchat', verifyAccess, startNewChat);
router.delete('/deletemessage', verifyAccess, deleteMessage);
router.delete('/clearchat', verifyAccess, clearChat);
router.delete('/deletechat', verifyAccess, deleteChat);
router.delete('/clearallchats', verifyAccess, clearAllChat);
router.delete('/deleteallchats', verifyAccess, deleteAllChat);


export default router;