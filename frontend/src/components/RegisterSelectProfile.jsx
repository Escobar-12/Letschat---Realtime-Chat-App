import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Camera } from "lucide-react";
import useAuthStore from "../store/AuthStore";

const RegisterSelectProfile = ({ setImg, userImg, editProfile = false }) => {
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(userImg || assets.userProfile);

  const uploadRef = useRef(null);

  const handleCameraClick = () => {
    uploadRef.current?.click();
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const tempUrl = URL.createObjectURL(file);
    setShowImage(tempUrl);

    if (editProfile) {
      await updateProfile(file);
    } else {
      setImg(file);
    }

    setLoading(false);
  };

  return (
    <div className="relative rounded-full border-[var(--color-accent)] p-0.5">
      <div
        className={`relative border-2 ${
          loading ? "isLoading" : "border-[var(--color-neutral)]"
        } w-20 h-20 rounded-full object-cover overflow-hidden cursor-pointer`}
        onClick={handleCameraClick}
      >
        <img
          className={`w-full h-full object-cover ${loading ? "isLoading" : ""}`}
          src={showImage || assets.userProfile}
          alt="upload area"
        />
        <input
          type="file"
          ref={uploadRef}
          className="hidden"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleUploadPic}
        />
      </div>

      <button
        type="button"
        onClick={handleCameraClick}
        className="absolute bottom-0 right-0 p-1 rounded-full shadow cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-[var(--text-color)]"
      >
        <Camera className="w-5 h-5" />
      </button>
    </div>
  );
};

export default RegisterSelectProfile;
