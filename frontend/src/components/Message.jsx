import React from 'react'
import IKGetImage from './IKGetImg'
import FirstLetterProfile from './FirstLetterProfile';

const Message = ({ me = false, text = "", profile = "", time , isGroup=false, sender=""}) => {

  const msgTime = new Date(time);
  const isValid = !isNaN(msgTime.getTime());
  const isOlderThenday = isValid && (msgTime - new Date()) > 1000 * 60 * 60 * 24; 

  const timer =isValid ? (isOlderThenday 
      ? msgTime
      : msgTime.toLocaleTimeString([],{hour:"2-digit", minute:"2-digit"})
    ) : "just now";

  return (
    <div className={`flex flex-col ${me ? "items-end" : "items-start"}  space-y-2 w-full`}>
      
      
      <div className={`${me ? "self-end" : "self-start"} message flex gap-2 items-start p-2`}>
        
        {isGroup && 
          (!me  ? 
            (
              profile ? 
              (<img src={profile} alt={sender} loading="lazy" className='size-8 md:size-12 object-cover rounded-full' />)
              :
              (<FirstLetterProfile name={sender}/>)
            ) 
            : 
            (
              <div></div>
            )
          )
        }
        <div className={`${me ? "text-[var(--text-color)] bg-[var(--color-primary)]/60" : "text-[var(--color-primary)] bg-[var(--color-neutral)]/30 "} flex flex-col items-start p-2 box`}>
          <p className={`text-xs lg:text-md text-[var(--color-primary)]/50 font-bold`}>
            {isGroup && !me && sender}
          </p>
          <p className='text-lg lg:text-xl font-semibold'>{text}</p>
          <p className={`text-xs mt-1 lg:text-md ${me ? "text-[var(--text-color)]/60" : "text-[var(--color-primary)]/50"} font-bold`}>
            {timer}
          </p>
        </div>
        
        
      </div>
    </div>
  )
}

export default Message
