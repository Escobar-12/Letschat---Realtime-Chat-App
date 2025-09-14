import React, { useEffect } from 'react'
import FirstLetterProfile from './FirstLetterProfile'
import useChatStore from '../store/useChatStore';
import { MdAdd } from "react-icons/md";


const FoundUser = ({user}) => {

    const {addNewChat} = useChatStore();

    const handleClick = (e) =>
    {
        e.stopPropagation();
        // add chat
        addNewChat(user._id);
    }
  return (
        
        <div  className={`w-full cursor-pointer p-3 flex justify-between items-center gap-3 transition-color duration-75 hover:bg-[var(--color-neutral)]/30 `} onClick={handleClick}>
            <div className='flex items-center gap-3 max-w-sm overflow-hidden'>
                <div className='relative '>
                    {
                        user.profilePic ? 
                            <img src={user.profilePic } alt={user.userName} className='size-12 object-cover rounded-full '/>
                        :
                        <FirstLetterProfile name={user.userName}/>
                    }
                </div>
                
                <div className=' text-left min-w-0'>
                    <div className='font-medium truncate '>{user.userName}</div>
                </div> 
            </div> 
            <div className='justify-self-end'> +</div>
           
        </div>
  )
}

export default FoundUser