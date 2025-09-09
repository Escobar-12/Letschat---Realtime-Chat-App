import { Router } from "express";

import { getChats,getChatMessages } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.get('/chats', verifyAccess, getChats);
router.get('/chat', verifyAccess, getChatMessages);


export default router;