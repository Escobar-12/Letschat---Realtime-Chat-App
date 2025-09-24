import React from 'react'
import useChatStore from '../store/useChatStore'
import Message from './Message';
import useAuthStore from '../store/AuthStore';



const MessageStack = () => {

  const {isMessagesLoading, messages, typingUsers, selectedChat} = useChatStore(); 
  const {auth} = useAuthStore();

  const currTypingUsers = typingUsers[selectedChat._id] || [];
  if(!isMessagesLoading && messages.length === 0 ) 
  {
    return <div className="flex items-center justify-center h-full w-full  flex-1 text-[var(--text-color)] bg-[var(--bg-color)] ">
      No Messages
    </div>
  }


  return (
    <div className='w-full flex-1 flex flex-col-reverse px-4 pb-2  overflow-auto gap-y-2 bg-[var(--bg-color)]'>
      {
        currTypingUsers.length > 0 && currTypingUsers?.map((typer) => 
        (
          <div className='flex flex-col gap-2 my-5  text-[var(--text-color)] text-sm md:text-md w-full'>
            <div className="box bg-[var(--color-neutral)]/30 flex items-center space-x-2 w-fit px-3 py-3">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </div>
            <p className=''>{typer} is typing...</p>
          </div>
        ))
      }

      {
        messages.map((message, i) =>
        (
          <Message key={message._id} me={message.senderId === auth.id} text={message.text} time={message.createdAt} pic={message.image}/>
        ))
      }
    </div>
    
  )
}

export default MessageStack