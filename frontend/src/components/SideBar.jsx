import React, { useEffect } from 'react'
import {Users} from "lucide-react" 

import useChatStore from '../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';

const SideBar = () => {

    const {getChats, participants, selectedChat, setSelectedChat, isChatsLoading} = useChatStore();

    const onlineUsers = [];

    useEffect(()=>
    {
        getChats();
    },[getChats])

    if(isChatsLoading) return <SideBarSkeleton/>

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-[var(--color-primary)] bg-[var(--color-primary)] flex flex-col transition-all duration-200 '>
            <div className='border-b border-[var(--color-primary)] w-full p-5'>
                <div className='flex items-center gap-2 mb-4 pb-4 border-b-2 border-[var(--color-accent)]'>
                    <Users className="size-6" />
                    <span className='font-mediun hidden lg:block '>Contacts</span>
                </div>

                {/* Online Fillter */}
                <div className='flex gap-2 items-center'>
                    <input type="checkbox" className='box outline-none size-5 ' />
                    <p className='text-[var(--color-neutral)] font-semibold text-lg '>Show online only</p>
                    <p className=' text-neutral-600'>(0 online)</p>
                </div>

                <div className='overflow-y-auto w-full py-3 '>
                    {
                        participants.map((user) => 
                        (
                            // hover
                            <button key={user.id} onClick={`w-full p-3 flex items-center gap-3 transition-color 
                                ${selectedChat?._id === user._id ? "bg-black ring-1 ring[var(--base-300)]" : "bg-white" } `}
                                >
                            <div className='relative mx-auto lg:mx-0'>
                                <img src={user.profilePic} alt="user.userName" className='size-12 object-cover rounded-full '/>
                                {
                                    onlineUsers.includes(user._id) && 
                                    (
                                        <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-800 ' />
                                    )
                                }
                            </div>

                            {/* User info */} 
                            <div className='hidden lg:block text-left min-w-0'>
                                <div className='font-medium truncate '>{user.userName}</div>
                                <p className='text-sm text-zinc-400 '>
                                    {onlineUsers.includes(user._id)} ? "Online" : "Offline"
                                </p>
                            </div>

                            </button>
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default SideBar