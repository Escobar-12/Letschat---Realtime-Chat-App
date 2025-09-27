import React, { useEffect, useRef, useState } from 'react'
import { FiSend } from "react-icons/fi";
import useChatStore from '../store/useChatStore';
import { Image } from 'lucide-react';
import { VscLoading } from "react-icons/vsc";
import toast from 'react-hot-toast';
import useAuthStore from '../store/AuthStore';


const MessageInput = ({disabled=false}) => {

  const {sendMessage, setIsTyping, selectedChat, sendAudio} = useChatStore();
  const {auth, socket} = useAuthStore();
  const inputRef = useRef();
  const imgRef = useRef();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [isSending, setIsSending] = useState(false);
  
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = async () =>
  {
    handleStopMessageTyping();
    const messageValue = inputRef.current.value.trim();
    if (!messageValue && !imageFile) return;
    setIsSending(true);
    const isSent = await sendMessage(messageValue, imageFile);
    if(!isSent) toast.error("Message not sent");
    setIsSending(false)
    inputRef.current.value = "";
    setImagePreview(null);
    setImageFile(null);
    inputRef.current.focus();
  }

  const handleImageChange = (e) =>
  {
    const file = e.target.files[0];
    if(!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    inputRef.current.focus();
  }

  // handle audio logic
  const mediaRecorderRef = useRef(null);
  const recordedDataRef = useRef([]);
  const handleAudioInput = async () =>
  {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    recordedDataRef.current = [];

    mediaRecorder.ondataavailable = (e) =>
    {
      if(e.data.size > 0) recordedDataRef.current.push(e.data);
    }
    mediaRecorder.onstop = async () =>
    {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(recordedDataRef.current, {type: 'audio/webm'});
      
      await sendAudio(blob);
    }
    mediaRecorder.start();
  }

  const stop = () =>
  {
    if(mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop()
  }

  const handleStartMessageTyping = () => {
    if (!socket || !selectedChat?._id) return;
    socket.emit('startTyping',{conversationId:selectedChat._id, typerId:auth.id});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId: selectedChat._id, typerId : auth.id });
    }, 2000);
  };

  const handleStopMessageTyping = () =>
  {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", { conversationId: selectedChat._id, typerId : auth.id });
  }

  return (
    <div className='w-full flex items-center justify-around gap-2 py-4 px-4  bg-[var(--bg-color)]'>
        <div className='px-3 py-2 box flex-1 border-2 border-[var(--color-primary)]' 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}>
            {imagePreview && <img src={imagePreview} alt="img" className=' h-10 md:h-20 mb-2'/>}
            <input onChange={handleStartMessageTyping} ref={inputRef} type="text" placeholder='Message' disabled={disabled} name="" id="" className='w-full outline-none p-1'/>
            <input ref={imgRef} onChange={handleImageChange} type="file" accept='image/*' className='hidden' name="" id="" />
        </div>
        <button type={'button'} className={`p-3 hidden sm:flex text-green-500 border-2 border-green-500`} onClick={() => imgRef.current?.click()}>
          <Image className='text-2xl'/>
        </button>
        <button onClick={!isSending && handleSendMessage} className='p-3 bg-[var(--color-primary)]/60 text-[var(--color-neutral)] cursor-pointer active:bg-[var(--color-primary)]/80 ' >
            
            { !isSending ? 
              (<FiSend className='text-2xl'/>)
              :
              (<VscLoading className='text-2xl animate-spin'/>)
            }
        </button>
        <button className='bg-red-400 h-3 w-3' onClick={handleAudioInput}></button>
        <button className='bg-gray-400 h-3 w-3' onClick={stop}></button>
    </div>
  )
}

export default MessageInput