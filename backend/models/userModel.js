import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    userName: {
        type:String,
        required: true,
        unique: true
    },
    pwd: {
        type:String,
        required: true,
    },
    profilePic: {
        type:String,
        default:"",
    },
    role: {
        type:Number,
        default:2000,
    }
},{timestamps:true});

export const userModel = mongoose.models.UserInfo || mongoose.model("UserInfo",userSchema);