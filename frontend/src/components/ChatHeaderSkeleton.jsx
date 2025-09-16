import React from 'react'
import useChatStore from '../store/useChatStore'

import { HiDotsVertical } from "react-icons/hi";
import { FaArrowLeftLong } from "react-icons/fa6";


const ChatHeaderSkeleton = () => {
  const { setSelectedChat } = useChatStore()

  return (
    <div className="relative w-full  flex items-center justify-between overflow-hidden">

      <div className="h-full flex-1 flex items-center justify-between p-2.5 pb-4 bg-[var(--bg-color)] rounded-tr-3xl ">
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={() => setSelectedChat(null)} 
            className="hover:bg-neutral-400/30 hover:scale-110 p-2 transition duration-150"
          >
            <FaArrowLeftLong size={25} className="cursor-pointer"/>
          </button>
          
          {/* Avatar */}
            <div className="relative">
                <div className="skeleton bg-[var(--color-neutral)]/80 size-8 md:size-12 rounded-full"/>
            </div>


          {/* User Info */}
            <div className="text-left min-w-0 flex-1">
                <div className="skeleton bg-[var(--color-neutral)]/80 h-4 w-32 mb-2 rounded-md"/>
                <div className="skeleton bg-[var(--color-neutral)]/60 h-3 w-16 rounded-md"/>
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

export default ChatHeaderSkeleton