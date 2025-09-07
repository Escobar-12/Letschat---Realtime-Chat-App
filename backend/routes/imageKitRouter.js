import { Router } from "express";
import crypto from "crypto";
import ImageKit from "imagekit";

const router = Router();

router.get("/auth", (req, res) =>
{
    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 60;
    const signature = crypto.createHmac("sha1", process.env.IMAGE_KIT_PRIVATE_KEY).update(token + expire).digest("hex");

    res.status(200).json({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    });
})

export default router;