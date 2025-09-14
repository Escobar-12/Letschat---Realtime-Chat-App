import React, { useEffect } from 'react'
import useChatStore from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageStack from './MessageStack'
import MessageInput from './MessageInput'
import useAuthStore from '../store/AuthStore'
import { Loader } from 'lucide-react';
import MessageStackSkeleton from './MessageStackSkeleton'


const ChatContainer = () => {

  const {messages,getMessages, isMessagesLoading, selectedChat } = useChatStore();

  useEffect(()=>
  {
    if (!selectedChat?._id) return;
    getMessages(selectedChat._id);
  },[selectedChat._id])



  if (isMessagesLoading) 
  {
    return (
    <div className=' w-full h-full flex flex-1 flex-col items-center justify-between overflow-auto rounded-xl'>
         {/* Header */}
        <ChatHeader />

        {/* Message Stack */}
        <MessageStackSkeleton />

        {/* Message input */}
        <MessageInput disabled/>
      </div>
    )
  }

 
  return (
    
    <div className=' w-full h-full flex flex-1 flex-col items-center justify-between overflow-auto rounded-xl rounded-tr-none'>
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