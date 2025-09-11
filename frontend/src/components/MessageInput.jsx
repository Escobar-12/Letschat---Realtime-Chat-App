import React, { useEffect, useRef, useState } from 'react'
import { FiSend } from "react-icons/fi";
import useChatStore from '../store/useChatStore';
import { Image } from 'lucide-react';

const MessageInput = ({disabled=false}) => {

  const {sendMessage} = useChatStore();
  const inputRef = useRef();
  const imgRef = useRef();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSendMessage = () =>
  {
    const messageValue = inputRef.current.value.trim();
    if (!messageValue && !imageFile) return;
    sendMessage(messageValue, imageFile);
    inputRef.current.value = "";
    setImagePreview(null);
    setImageFile(null);
    inputRef.current.focus();
  }

  const handleImageChange = (e) =>
  {
    const file = e.target.files[0];
    if(!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  useEffect((e) =>
  {
    const handleKeyDown = (e) => 
    {
      if (e.key === "Enter" && !disabled) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  },[])
  
  return (
    <div className='w-full flex items-center justify-around gap-2 my-4'>
        <div className='px-3 py-2 box flex-1 border-2 border-[var(--color-primary)]'>
            {imagePreview && <img src={imagePreview} alt="img" className=' h-10 md:h-20 mb-2'/>}
            <input ref={inputRef} type="text" placeholder='Message' disabled={disabled} name="" id="" className='w-full outline-none p-1'/>
            <input ref={imgRef} onChange={handleImageChange} type="file" accept='image/*' className='hidden' name="" id="" />
        </div>
        <button type={'button'} className={`p-3 hidden sm:flex text-green-500 border-2 border-green-500`} onClick={() => imgRef.current?.click()}>
          <Image className='text-2xl'/>
        </button>
        <button onClick={handleSendMessage} className='p-3 bg-[var(--color-primary)]/60 text-[var(--color-neutral)] cursor-pointer active:bg-[var(--color-primary)]/80 '>
            <FiSend className='text-2xl'/>
        </button>
    </div>
  )
}

export default MessageInput