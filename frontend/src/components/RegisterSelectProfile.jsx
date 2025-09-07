import React from 'react'
import { useEffect, useState, useRef } from "react";
import { assets } from '../assets/assets';
import {Camera} from 'lucide-react'
import useAuthStore from '../store/AuthStore';


const RegisterSelectProfile = ({setImg, userImg, editProfile=false}) => {
    const updateProfile = useAuthStore((state) => state.updateProfile);

    const [loading, setLoading] = useState();
    const [showImage, setShowImage] = useState(userImg || assets.userProfile);

    const uploadRef = useRef(null);

    const handleCameraClick = () => {
        if (uploadRef.current) {
        uploadRef.current.click();
        }
    };

    const handleUploadPic = async (e) =>
    {
        const file = e.target.files[0];
        if(!file) return;        

        setLoading(true);
        const tempUrl = URL.createObjectURL(file);
        setShowImage(tempUrl);
        if(editProfile)
        {
            setLoading(true);
            await updateProfile(file);
        }
        else
        {
            setImg(file);
        }
        setLoading(false);
    }
  

  return (
    <div className='relative rounded-full border-2 border-gray-400 p-0.5'>
        <div className={`relative border ${loading ? "isLoading" : ""} w-20 h-20 rounded-full object-cover overflow-hidden cursor-pointer`}>
            <img
                className={`w-full h-full object-cover ${loading ? "isLoading" : ""}`}
                src={showImage||assets.userProfile}
                alt="upload area"
            />
            <div className="absolute inset-0 flex justify-center items-center opacity-0 cursor-pointer " onClick={handleCameraClick}>
                <input type="file" ref={uploadRef} className="hidden" accept={["image/jpeg","image/png","image/jpg"]} onChange={(e) => handleUploadPic(e)}/>
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