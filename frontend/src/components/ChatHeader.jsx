import React from 'react'
import useChatStore from '../store/useChatStore'
import FirstLetterProfile from "../components/FirstLetterProfile"

import { FaArrowLeftLong } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat, onlineUsers } = useChatStore()

  return (
    <div className="relative w-full  flex items-center justify-between overflow-hidden">
      {/* Curved background */}
      {/* <div className="absolute inset-0 bg-[var(--bg-color)] curved-header "></div> */}
      {/* Content */}
      <div className="h-full flex-1 flex items-center justify-between p-2.5 pb-4 bg-[var(--bg-color)] rounded-tr-3xl ">
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={() => setSelectedChat(null)} 
            className="hover:bg-neutral-400/30 hover:scale-110 p-2 transition duration-150"
          >
            <FaArrowLeftLong size={25} className="cursor-pointer"/>
          </button>
          
          {/* Avatar */}
          <FirstLetterProfile name={selectedChat.participants[0].userName} />

          {/* User Info */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{selectedChat.participants[0].userName}</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.includes(selectedChat._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>


        {/* Menu */}
        
      </div>
      <div className='relative h-full curved-header bg-transparent flex items-center justify-center w-[12%] lg:w-[10%] xl:w-[8%] ' >
          <button 
            onClick={() => setSelectedChat(null)} 
            className="absolute hover:bg-neutral-400/30 hover:scale-110 p-2 transition  duration-150"
          >
            <HiDotsVertical size={25} className="cursor-pointer"/>
          </button>
        </div>
    </div>
  )
}

export default ChatHeader
