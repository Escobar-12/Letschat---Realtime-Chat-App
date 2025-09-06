import React from 'react'
import { IKContext, IKUpload } from 'imagekitio-react';
import { useEffect, useState, useRef } from "react";
import useApplication from '../hooks/applicationHook';
import { assets } from '../assets/assets';
import {Camera} from 'lucide-react'


const RegisterSelectProfile = ({setImg, userImg}) => {
    const [loading, setLoading] = useState();
    const [showImage, setShowImage] = useState(userImg || assets.userProfile);
    const { imageKitConfig, authenticator } = useApplication();

    const uploadRef = useRef(null);

    const handleCameraClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  return (
    <div className='relative rounded-full border-2 border-gray-400 p-0.5'>
        <div className={`relative border ${loading ? "isLoading" : ""} w-20 h-20 rounded-full object-cover overflow-hidden cursor-pointer`}>
            <img
                className={`w-full h-full object-cover ${loading ? "isLoading" : ""}`}
                src={showImage||assets.userProfile}
                alt="upload area"
            />
            <div className="absolute inset-0 flex justify-center items-center opacity-0 cursor-pointer ">
                <IKContext
                    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                    publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
                    authenticator={authenticator}
                >
                    <IKUpload ref={uploadRef}
                    accept={["image/jpeg", "image/png", "image/jpg"]}
                        useUniqueFileName={true}
                        onUploadStart={() => {
                            setLoading(true);
                        }}
                        onSuccess={(res) => {
                            if (!res?.url) return;
                            setImg(res.name);
                            setShowImage(res.url);
                            setLoading(false);
                        }}
                        className="w-full h-full cursor-pointer"
                        onError={(err) => console.error("Upload error:", err)}
                    />
                </IKContext>
            </div>
        </div>
        <button
            type="button" onClick={handleCameraClick}
            className="absolute bottom-0 right-0 p-0.5 bg-gray-400 rounded-full shadow cursor-pointer outline-none">
            <Camera className="size-5 " />
        </button>
    </div>
  )
}

export default RegisterSelectProfile