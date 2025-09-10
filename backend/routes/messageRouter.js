import { Router } from "express";

import { getChats,getChatMessages,startNewChat  } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.get('/chats', verifyAccess, getChats);
router.post('/chat', verifyAccess, getChatMessages);
router.post('/newchat', verifyAccess, startNewChat)


export default router;