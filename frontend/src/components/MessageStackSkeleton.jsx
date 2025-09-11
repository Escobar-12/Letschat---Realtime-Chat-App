import React from 'react'
import MessageSkeleton from './MessageSkeleton'



const MessageStackSkeleton = () => {
  return (
    <div className='w-full h-full flex-1 flex flex-col  overflow-auto p-4 space-y-4 '>
        <MessageSkeleton />
        <MessageSkeleton me />
        <MessageSkeleton me/>
        <MessageSkeleton />
        <MessageSkeleton me/>
        <MessageSkeleton />
        <MessageSkeleton me/>
        <MessageSkeleton />
    </div>
  )
}

export default MessageStackSkeleton