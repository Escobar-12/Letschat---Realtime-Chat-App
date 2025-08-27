import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import ImageKit from "imagekit";

import { userModel } from "../models/userModel.js";
import { allowedRoles } from "../config/allowedRols.js";

export const register = async (req, res) =>
{
    const {userName, email, pwd, img} = req.body;
    if(!userName || !email || !pwd) return res.status(400).json({success:false, message:"Missing credentials"});
    try
    {
        const userFoundWithEmail = await userModel.findOne({email});
        const userFoundWithName = await userModel.findOne({userName});
        if (userFoundWithEmail || userFoundWithName) {
            return res.status(409).json({ success: false, message: "User already exists." });
        }
        const hashedPwd = await bcrypt.hash(pwd,10);
        const newUser = await userModel.create({
            userName,email,img,role:allowedRoles.User,
            pwd:hashedPwd,
        });
        const uplaodedImg = await ImageKit.uplaod({
            file:img,
            fileName:`${userName}_profile`,
        });
        const Access_token = jwt.sign(
            {id:newUser._id,userName},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"10m"}
        );

        const Refresh_token = jwt.sign(
            {id:newUser._id,userName},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"1d"}
        );

        res.cookie("jwt", Refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Lax"
        });

        return res.status(200).json(
            {
                id:newUser._id,
                user:newUser.userName,
                Access_token,
                role: newUser.role,
                profile:newUser.img
            }
        );
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Error while registering" });
    }
}


export const login = async (req, res) =>
{
    const {userName, email, pwd} = req.body;
    if((!userName && !email) || ! pwd) return res.status(400).json({success:false, message: "Missing credentials"});
    try
    {
        const userFound = await userModel.findOne({$or:[{userName},{email}]});
        if(!userFound)  return res.status(401).json({success:false, message:"Invalid username or password"});
        const checkPwd = await bcrypt.compare(pwd, userFound.pwd);
        if(!checkPwd)  return res.status(401).json({success:false, message:"Invalid username or password"});

        const Access_token = jwt.sign(
            {
                id:userFound._id, name:userName
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10m'}
        );
        const Refresh_token = jwt.sign(
            {
                id:userFound._id, name:userName
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'}
        );
        res.cookie('jwt', Refresh_token, {
            httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite:"Lax", //secure:true
        })

        res.status(200).json({
            id:userFound._id,
            user:userFound.userName,
            Access_token,
            role:userFound.role,
            profile:userFound.img
        })
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}

export const logout = async (req, res) =>
{
    try
    {
        const cookies = req.cookies;
        if(!cookies?.jwt) 
        {
            return res.status(204).json({ success: true, message: "No content, user already logged out." });
        }
        res.clearCookie("jwt",{httpOnly: true, sameSite:"Lax"});
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}


export const refresh = async (req, res) => 
{
    const refreshToken = req.cookies?.jwt;
    if(!refreshToken) return res.status(401).json({success:false, message:"No token found"});
    
    try
    {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign(
            { id: decoded.id, name: decoded.name },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "10m"}
        )
        const userFound = await userModel.findById(decoded.id);
        if(!userFound) return res.status(401).json({success:false,message:"Server Error"})
        res.json({ 
            id:userFound.id,
            user: userFound.name,  
            Access_token: newAccessToken, 
            role: userFound.role ,
            profile:userFound.img
        });
    }
    catch(err)
    {
        console.error("Error verifying refresh token:", err);
        res.clearCookie("jwt",{httpOnly: true, sameSite:"Lax"});
        res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
}


export const updateProfile = async (req, res) =>
{
    const {profilePic} = req.body;
    if(!profilePic) return res.status(400).json({success: false, message:"Profile pic is required"})
    const userId = req.user.id;
    try
    {
        const uplaodedImg = await ImageKit.uplaod({
            file:img,
            fileName:`${userName}_profile`,
        });
        const updatedUser = await userModel.findByIdAndUpdate(userId, {profilePic:uplaodedImg.fileName}, {new: true});
        res.status(200).json({success:true, updatedUser, message:"Profile updated successfully"})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}