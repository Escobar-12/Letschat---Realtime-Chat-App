import React, { useEffect } from 'react'
import useChatStore from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageStack from './MessageStack'
import MessageInput from './MessageInput'
import useAuthStore from '../store/AuthStore'
import { Loader } from 'lucide-react';
import MessageStackSkeleton from './MessageStackSkeleton'
import ChatHeaderSkeleton from './ChatHeaderSkeleton'


const ChatContainer = () => {

  const {messages,getMessages, isMessagesLoading, selectedChat, isCreatingNewChat } = useChatStore();

  useEffect(()=>
  {
    if (!selectedChat?._id) return;
    getMessages(selectedChat._id);
  },[selectedChat._id])


  if(isCreatingNewChat)
  {
    return(
      <div className=' h-[calc(100vh-80px)] md:h-full max-md:m-3 w-full bg-[var(--bg-color)] flex flex-1 items-center justify-center overflow-auto rounded-xl'>
         <Loader className='animate-spin'/>
      </div>

    )
  }


  if (isMessagesLoading) 
  {
    return (
    <div className=' h-[calc(100vh-80px)] md:h-full max-md:m-3 w-full flex flex-1 flex-col items-center justify-between overflow-auto rounded-xl'>
         {/* Header */}
        <ChatHeaderSkeleton />

        {/* Message Stack */}
        <MessageStackSkeleton />

        {/* Message input */}
        <MessageInput disabled/>
      </div>
    )
  }

 
  return (
    
    <div className=' h-[calc(100vh-80px)] md:h-full max-md:m-3 w-full  flex flex-1 flex-col items-center justify-between overflow-auto rounded-xl rounded-tr-none'>
      {/* Header */}
      <ChatHeader />

      <div className='h-2 w-full bg-[var(--bg-color)]'/>

      {/* Message Stack */}
      <MessageStack />

      {/* Message input */}
      <MessageInput />

    </div>
    
    
  )
}

export default ChatContainer