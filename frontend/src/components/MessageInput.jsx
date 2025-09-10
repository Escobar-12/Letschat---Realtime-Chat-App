import React from 'react'
import { FiSend } from "react-icons/fi";


const MessageInput = ({disabled=false}) => {
  return (
    <div className='w-full flex items-center justify-around gap-2 '>
        <div className='px-3 py-2 rounded-full flex-1 border-2 border-[var(--color-neutral)]'>
            <input type="text" placeholder='Message' disabled={disabled} name="" id="" className='w-full outline-none p-1'/>
        </div>
        <button className='p-3 bg-[var(--color-primary)]/60 text-[var(--color-neutral)] cursor-pointer active:bg-[var(--color-primary)]/80 '>
            <FiSend className='text-2xl'/>
        </button>
    </div>
  )
}

export default MessageInput