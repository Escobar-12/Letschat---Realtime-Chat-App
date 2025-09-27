import { Router } from "express";
import multer from "multer";

import { getChats,getChatMessages,startNewChat, startNewGroup, sendMessage, clearChat, deleteChat, deleteMessage, deleteAllChat, clearAllChat, sendAudio } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({storage});


router.get('/chats', verifyAccess, getChats);
router.post('/chat', verifyAccess, getChatMessages);
router.post('/send', verifyAccess, sendMessage);
router.post('/sendaudio', verifyAccess, upload.single("audio"), sendAudio);
router.post('/newchat', verifyAccess, startNewChat);
router.post('/newgroup', verifyAccess, startNewGroup);
router.delete('/deletemessage', verifyAccess, deleteMessage);
router.delete('/clearchat', verifyAccess, clearChat);
router.delete('/deletechat', verifyAccess, deleteChat);
router.delete('/clearallchats', verifyAccess, clearAllChat);
router.delete('/deleteallchats', verifyAccess, deleteAllChat);


export default router;