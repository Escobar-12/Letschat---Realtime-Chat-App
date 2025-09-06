import {Router} from "express"

import { userModel } from "../models/userModel.js";
import {login, register, logout, updateProfile, refresh} from "../controllers/authController.js" 
import { verifyAccess } from "../middleware/verifyAccess.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.put("/updateprofile",verifyAccess, updateProfile);

router.get("/me", verifyAccess, async (req, res)=> 
{
    try 
    {
        const user = await userModel.findById(req.user.id).select("-password");
        if(!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ 
            user: user.userName, 
            roles: user.role,
            profile: user.profilePic,
            id:user._id
        });
    }
    catch(err)
    {
        res.status(500).json({ message: "Server error", error: err.message });
    }
})

export default router;