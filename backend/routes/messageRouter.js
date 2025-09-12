import { Router } from "express";

import { getChats,getChatMessages,startNewChat, sendMessage, clearChat  } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.get('/chats', verifyAccess, getChats);
router.post('/chat', verifyAccess, getChatMessages);
router.post('/send', verifyAccess, sendMessage);
router.post('/newchat', verifyAccess, startNewChat);
router.delete('/clearchat', verifyAccess, clearChat);


export default router;