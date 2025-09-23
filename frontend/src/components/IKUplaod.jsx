import React from 'react'
import ImageKit from "imagekit-javascript"

const IKUplaod = async (file) => {
    try
    {
        const res = await fetch("http://localhost:5002/api/imagekit/auth");
        const body = await res.json();
        
        const imageKit = new ImageKit({
            urlEndpoint:body.urlEndpoint,
            publicKey:body.publicKey,
            authenticationEndpoint: "http://localhost:5002/api/imagekit/auth", 
        })
        return new Promise((resolve, reject) =>
        {
            imageKit.upload(
                {
                    file: file,
                    fileName: file.name,
                    token:body.token,
                    expire:body.expire,
                    signature:body.signature,
                    accept:["image/*"],
                    useUniqueFileName:true,
                },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            )
        })
    }
    catch(err) 
    {
        console.error("Image upload failed:", err);
        throw err; 
    }
}

export default IKUplaod