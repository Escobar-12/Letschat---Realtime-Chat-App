import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js";

export const verifyAccess = async (req, res, next) =>
{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized: No Token Provided" });

    const token = authHeader.split(" ")[1];
    try
    {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userFound = await userModel.findById(decoded.id);
        if (!userFound) return res.status(401).json({ message: "Unauthorized: User not found" });
        req.user = {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
        };

        next();
    }
    catch (err) 
    {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}