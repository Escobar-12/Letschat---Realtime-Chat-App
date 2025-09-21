import React, { useState } from 'react'
import useChatStore from '../store/useChatStore'
import FirstLetterProfile from "../components/FirstLetterProfile"

import { FaArrowLeftLong } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { useRef } from 'react';

const ChatHeader = () => {
  const { selectedChat, setSelectedChat, onlineUsers, clearChat, deleteChat } = useChatStore();

  const [menuDialog, setMenuDialog] = useState(false); 
  const menuRef = useRef();



  return (
    <div className="relative w-full flex items-center justify-between overflow-hidden">

      <div className="h-full flex-1 flex items-center justify-between p-2.5 pb-4 bg-[var(--bg-color)] rounded-tr-3xl ">
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={() => setSelectedChat(null)} 
            className="hover:bg-neutral-400/30 hover:scale-110 p-2 transition duration-150"
          >
            <FaArrowLeftLong size={25} className="cursor-pointer"/>
          </button>
          
          {/* Avatar */}
          {
              selectedChat.participants[0].profilePic ? 
                  <img src={selectedChat.participants[0].profilePic } alt={selectedChat.participants[0].userName} className='size-12 object-cover rounded-full '/>
              :
              <FirstLetterProfile name={selectedChat.participants[0].userName}/>
          }


          {/* User Info */}
          <div className="flex flex-col">
            <h3 className="font-semibold md:text-lg">{selectedChat.participants[0].userName}</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {onlineUsers?.includes(selectedChat._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>


        {/* Menu */}
        
      </div>
      <div className='relative h-full curved-header bg-transparent flex items-center justify-center w-[12%] lg:w-[10%] xl:w-[8%] ' >
        
        <button 
            onClick={() => setMenuDialog(prev => !prev)}
          className="absolute hover:bg-neutral-400/30 hover:scale-110 p-1 lg:p-2 transition  duration-150"
        >
          <HiDotsVertical className="cursor-pointer size-5 md:size-7"/>
        </button>
        
        {/* dialog */}
        <div ref={menuRef} className={`absolute ${menuDialog ? "h-fit opacity-100 ": "h-0 opacity-0 pointer-events-none" }  w-full flex flex-col gap-1 bg-[var(--bg-color)] top-full right-0 border-2 border-[var(--color-primary)]  box  transition-all duration-150`}>
            <div className='w-full p-2 md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={deleteChat}>
                <p>Delete All Chats</p>
            </div>
            <div className='w-full p-1.5 text-[var(--text-color)] md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={clearChat}>
                <p>Clear All Chats</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
