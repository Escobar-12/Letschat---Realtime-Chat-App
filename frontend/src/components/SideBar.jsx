import React, { useEffect } from 'react'
import {Users} from "lucide-react" 

import useChatStore from '../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';
import FirstLetterProfile from './FirstLetterProfile';
import useAuthStore from '../store/AuthStore';
import Friend from './Friend';



const SideBar = () => {
    const {participants, getChats, selectedChat,onlineUsers, setSelectedChat, isChatsLoading} = useChatStore();

    useEffect(()=>
    {
        getChats();
    },[])


    if(isChatsLoading ) return <SideBarSkeleton/>

    return (
        <aside className='h-full w-20 lg:w-72 bg-[var(--bg-color)] flex flex-col transition-all duration-200 ' onClick={() => setSelectedChat(null)}>
            <div className='w-full'>
                <div className=' p-5 '>
                    <div className='flex w-full items-center justify-center lg:justify-start gap-2 pb-4 border-b-2 border-[var(--color-primary)]'>
                        <Users className="size-6" />
                        <span className='font-medium hidden lg:block '>Contacts</span>
                    </div>
                </div>

                {/* Online Fillter
                <div className='flex gap-2 items-center'>
                    <input type="checkbox" className='box outline-none size-5 ' />
                    <p className='text-[var(--color-primary)]/80 font-semibold text-lg '>Show online only</p>
                    <p className=' text-neutral-500'>({onlineUsers.length} online)</p>
                </div> */}

                <div className='overflow-y-auto w-full pt-3 '>
                    {
                        participants.map((chat, i)=>
                        (
                            <div key={chat._id}>
                                <Friend chat={chat}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default SideBar