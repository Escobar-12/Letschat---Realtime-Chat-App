import { Router } from "express";
import ImageKit from "imagekit";

const router = Router();

const imageKit = new ImageKit({
    urlEndpoint:`${process.env.IMAGE_KIT_ENDPOINT}`,
    publicKey:`${process.env.IMAGE_KIT_PUBLIC_KEY}`,
    privateKey:`${process.env.IMAGE_KIT_PRIVATE_KEY}`
})

router.get("/auth", async (req, res) =>
{
    try
    {
        const params = await imageKit.getAuthenticationParameters();
        res.json(params);
    }   
    catch (err) {
        console.error('Error fetching ImageKit auth params:', err);
        res.status(500).send({ message: 'Error fetching ImageKit auth parameters' });
    }
})

export default router;