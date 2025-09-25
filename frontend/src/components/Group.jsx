import React, { useEffect } from 'react'
import FirstLetterProfile from './FirstLetterProfile'
import useChatStore from '../store/useChatStore';


const Group = ({chat=null}) => {
    if(!chat) return;
    const {selectedChat ,setSelectedChat} = useChatStore();

    const handleClick = (e) =>
    {
        e.stopPropagation();
        setSelectedChat(chat);
    }
  return (
        
        <div  className={`w-full cursor-pointer p-3 flex items-center gap-3 transition-color duration-75 hover:${selectedChat?._id !== chat?._id  ? "bg-[var(--color-neutral)]/90":  "" } ${selectedChat?._id === chat?._id  ? "bg-[var(--color-neutral)]/50":"" } `} onClick={handleClick}>
            <div className='relative '>
                {
                    chat.groupImage ? 
                        <img src={chat.groupImage } alt={chat.groupName} className='size-8 md:size-12 object-cover rounded-full '/>
                    :
                    <FirstLetterProfile name={chat.groupName}/>
                }
            </div>

            
            <div className=' text-left min-w-0 text-[var(--text-color)]'>
                <div className='font-medium truncate '>{chat.groupName}</div>
            </div> 
           
        </div>
  )
}

export default Group;