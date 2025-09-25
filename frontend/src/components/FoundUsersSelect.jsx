import FirstLetterProfile from './FirstLetterProfile'
import useChatStore from '../store/useChatStore';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';


const FoundUserSelect = ({user, selectedMembers=[], setSelectedMembers}) => {
    if(!user) return;
    const {addNewChat} = useChatStore();

    const checkBoxRef = useRef(null);

    const handleClick = (e) =>
    {
        setSelectedMembers(prev => 
            {
                if (prev.includes(user._id)) return prev.filter(u => u !== user._id);
                else return [...prev, user._id];
            }
        );
    }
    

    return (
        
        <div  className={`w-full cursor-pointer p-3 flex justify-between items-center gap-3 transition-color duration-75 hover:bg-[var(--color-neutral)]/30 `} onClick={handleClick}>
            <div className='flex items-center gap-3 max-w-sm overflow-hidden'>
                <input ref={checkBoxRef} checked={selectedMembers && selectedMembers.includes(user._id)} type="checkbox" name="" id="" className='h-6 w-6'/>
                <div className='relative '>
                    {
                        user.profilePic ? 
                            <img src={user.profilePic } alt={user.userName} className='size-8 md:size-12 object-cover rounded-full '/>
                        :
                        <FirstLetterProfile name={user.userName}/>
                    }
                </div>
                
                <div className=' text-left min-w-0 text-[var(--text-color)]'>
                    <div className='font-medium truncate '>{user.userName}</div>
                </div> 
            </div> 
        </div>
  )
}

export default FoundUserSelect;