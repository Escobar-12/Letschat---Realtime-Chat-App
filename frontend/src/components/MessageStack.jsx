import React from 'react'
import useChatStore from '../store/useChatStore'
import Message from './Message';
import useAuthStore from '../store/AuthStore';



const MessageStack = () => {

  const {isMessagesLoading, messages} = useChatStore(); 
  const {auth} = useAuthStore();
  if(!isMessagesLoading && messages.length === 0 ) 
  {
    return <div className="flex items-center justify-center h-full w-full flex-1 text-[var(--text-color)]  ">
      No Messages
    </div>
  }

  console.log(messages)


  return (
    <div className='w-full flex-1 flex flex-col-reverse p-4 overflow-auto space-y-4 '>
      {
        messages.map((message, i) =>
        (
          <Message key={message._id} me={message.senderId === auth.id} text={message.text} time={message.createdAt ? new Date(message.createdAt).toLocaleString() : "just now"} pic={message.image}/>
        ))
      }
    </div>
  )
}

export default MessageStack