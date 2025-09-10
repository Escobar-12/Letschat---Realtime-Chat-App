import React from 'react'
import useChatStore from '../store/useChatStore'
import FirstLetterProfile from "../components/FirstLetterProfile"
import { FaRegWindowClose } from "react-icons/fa";


const ChatHeader = () => {

  const { selectedChat, setSelectedChat, onlineUsers} = useChatStore()
  return (
    <div className='p-2.5 pb-4 w-full border-b-3 border-[var(--bg-color)]/70 ' >
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-3'>
          {/* Avatar */}
          <FirstLetterProfile name={selectedChat.participants[0].userName}/>
    
          {/* User Info */}
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-lg'>{selectedChat.participants[0].userName}</h3>
            <p className='text-sm text-gray-500'>{onlineUsers.includes(selectedChat._id) ? "Online" : "Offline"}</p>
          </div>
        </div>
          <button onClick={() => setSelectedChat(null)}>
            <FaRegWindowClose size={25} className='cursor-pointer'/>
          </button>
        
      </div>
    </div>
  )
}

export default ChatHeader