import React, { useEffect } from 'react'
import useChatStore from '../store/useChatStore'
import {Loader} from "lucide-react"
import ChatHeader from './ChatHeader'
import MessageStack from './MessageStack'
import MessageInput from './MessageInput'
import useAuthStore from '../store/AuthStore'


const ChatContainer = () => {

  const {messages,getMessages, isMessagesLoading, selectedChat } = useChatStore();

  useEffect(()=>
  {
    if (!selectedChat?._id) return;
    getMessages(selectedChat._id);
  },[selectedChat._id])

  useEffect(()=>
  {
    console.log(messages);
  },[messages])
  

  if (isMessagesLoading) 
  {
    return <div className="flex items-center justify-center h-full flex-1  bg-[var(--color-neutral)]"><Loader className="animate-spin w-6 h-6" /></div>
  }
  return (
    
    <div className=' w-full h-full flex flex-1 flex-col items-center justify-between py-1 px-10 bg-[var(--color-neutral)] overflow-auto'>
      {/* Header */}
      <ChatHeader />

      {/* Message Stack */}
      <MessageStack />

      {/* Message input */}
      <MessageInput />

    </div>
    
    
  )
}

export default ChatContainer