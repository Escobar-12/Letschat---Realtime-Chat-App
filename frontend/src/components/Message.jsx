import React, { useState } from 'react'
import IKGetImage from './IKGetImg'
import FirstLetterProfile from './FirstLetterProfile';

const Message = ({ isAudio=false, audioBuffer="", me = false, text = "", profile = "", time , isGroup=false, sender=""}) => {

  const msgTime = new Date(time);
  const isValid = !isNaN(msgTime.getTime());
  const isOlderThenday = isValid && (msgTime - new Date()) > 1000 * 60 * 60 * 24; 

  const timer =isValid ? (isOlderThenday 
      ? msgTime
      : msgTime.toLocaleTimeString([],{hour:"2-digit", minute:"2-digit"})
    ) : "just now";

  
  // handle audio reading
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const handlePlayAudio = () =>
  {
    if(!audioInstance)
    {

      const binaryString = atob(audioBuffer);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);


      const blob = new Blob([bytes], {type: "audio/*"});
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioInstance(audio);
      audio.play();
      setIsPlaying(true);

      audio.onended = () =>
      {
        setIsPlaying(false);
        setAudioInstance(null);
      }
    }
    else
    {
      if(isPlaying)
      {
        audioInstance.pause();
      }
      else{
        audioInstance.play();
      }
    }
  }

  return (
    <div className={`flex flex-col ${me ? "items-end" : "items-start"}  space-y-2 w-full`}>
      
      
      <div className={`${me ? "self-end" : "self-start"} message flex gap-2 items-start p-2`}>
        
        {isGroup && !me &&
            (
              profile ? 
              (<img src={profile} alt={sender} loading="lazy" className='size-8 md:size-12 object-cover rounded-full' />)
              :
              (<FirstLetterProfile name={sender}/>)
            ) 
            
        }
         <div className={`${me ? "text-[var(--text-color)] bg-[var(--color-primary)]/60" : "text-[var(--color-primary)] bg-[var(--color-neutral)]/30"} flex flex-col items-start p-2 box`}>
          {isGroup && !me && (
            <p className='text-xs lg:text-md text-[var(--color-primary)]/50 font-bold'>{sender}</p>
          )}

          {isAudio ? (
            <button
              onClick={handlePlayAudio}
              className={`px-4 py-2 my-2 rounded-md font-semibold ${me ? "bg-green-500 text-white" : "bg-blue-300 text-black"}`}
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play Audio"}
            </button>
          ) : (
            <p className='text-lg lg:text-xl font-semibold'>{text}</p>
          )}

          <p className={`text-xs mt-1 lg:text-md ${me ? "text-[var(--text-color)]/60" : "text-[var(--color-primary)]/50"} font-bold`}>
            {timer}
          </p>
        </div>
        
        
      </div>
    </div>
  )
}

export default Message
