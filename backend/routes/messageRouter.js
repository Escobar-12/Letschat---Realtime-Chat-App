import { Router } from "express";

import { getFriends } from "../controllers/messageController.js";
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.get('/users', verifyAccess, getFriends)


export default router;