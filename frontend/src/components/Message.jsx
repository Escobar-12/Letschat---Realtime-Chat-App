import React from 'react'
import IKGetImage from './IKGetImg'

const Message = ({ me = false, text = "", pic = "", time = new Date() }) => {

  const msgTime = time instanceof Date ? time : new Date(time);
  const isOlderThenday = (time - new Date()) > 1000 * 60 * 60 * 24; 

  const timer = isOlderThenday 
      ? time
  : msgTime.toLocaleTimeString([],{hour:"2-digit", minute:"2-digit"})

  return (
    <div className={`flex flex-col ${me ? "items-end" : "items-start"}  space-y-2 w-full`}>
      
      
      <div className={`${me ? "text-[var(--text-color)] bg-[var(--color-primary)]/60 self-end" : "text-[var(--color-primary)] bg-[var(--color-neutral)]/30 self-start"} message flex flex-col items-start p-2`}>
        
        {pic && (
          <IKGetImage 
            path={pic} 
            className="rounded-md mt-2 max-w-full" 
            w={200} 
            h={200} 
          />
        )}
        
        <p className='text-lg lg:text-xl font-semibold'>{text}</p>
        <p className={`text-xs mt-1 lg:text-md ${me ? "text-[var(--text-color)]/60" : "text-[var(--color-primary)]/50"} font-bold`}>
          {timer}
        </p>
      </div>
    </div>
  )
}

export default Message
