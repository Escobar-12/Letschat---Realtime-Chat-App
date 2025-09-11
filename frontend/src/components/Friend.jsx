import React, { useEffect } from 'react'
import FirstLetterProfile from './FirstLetterProfile'
import useChatStore from '../store/useChatStore';


const Friend = ({chat, online=false}) => {
    const {selectedChat ,setSelectedChat} = useChatStore();
    const friend = chat.participants[0];

    const handleClick = (e) =>
    {
        e.stopPropagation();
        setSelectedChat(chat);
    }
  return (
        
        <div  className={`w-full p-3 flex items-center gap-3 transition-color duration-75 hover:${selectedChat?._id !== chat._id  ? "bg-[var(--color-neutral)]/90":  "" } ${selectedChat?._id === chat._id  ? "bg-[var(--color-neutral)]/50":"" } `} onClick={handleClick}>
            <div className='relative mx-auto lg:mx-0'>
                {
                    friend.profilePic ? 
                        <img src={friend.profilePic } alt={friend.userName} className='size-12 object-cover rounded-full '/>
                    :
                    <FirstLetterProfile name={friend.userName}/>
                }
                {
                    online && 
                    (
                        <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-800 ' />
                    )
                }
            </div>

            
            <div className='hidden lg:block text-left min-w-0'>
                <div className='font-medium truncate '>{friend.userName}</div>
                <p className='text-sm text-zinc-400 '>
                    {online ? "Online" : "Offline"}
                </p>
            </div> 
           
        </div>
  )
}

export default Friend