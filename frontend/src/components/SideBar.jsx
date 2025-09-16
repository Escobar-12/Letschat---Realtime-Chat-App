import React, { useEffect, useState } from 'react'
import {Loader} from "lucide-react" 

import useChatStore from '../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';
import FirstLetterProfile from './FirstLetterProfile';
import useAuthStore from '../store/AuthStore';
import Friend from './Friend';
import FoundUser from './SearchedUsers';

import { FaSearch } from "react-icons/fa";



const SideBar = () => {
    const {participants, getChats, selectedChat, isSearchingForUsers, searchUsers, searchedUsers, setSelectedChat, isChatsLoading} = useChatStore();
    const {onlineUsers} = useAuthStore();

    if(!onlineUsers) retrun;

    const {auth} = useAuthStore();

    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");

    const toggleSearch = () =>
    {
        setOpenSearch(prev => !prev);

    }

    const findUsers = (e) =>
    {
        setSearch(e.target.value);
    }

    useEffect(()=>
    {
        if (search.trim()) 
        {
            searchUsers(search);
        }
    },[search])

    useEffect(()=>
    {
        getChats();
    },[])



    if(isChatsLoading ) return <SideBarSkeleton/>

    return (
        <aside className='h-[calc(100vh-80px)] md:h-full w-full md:w-84 max-md:m-3 bg-[var(--bg-color)] transition-all duration-200 rounded-xl' >
            <div className=' relative w-full h-full flex flex-col'>
                <div className='flex items-center justify-between p-5'>
                    <div className='flex justify-between w-full items-center gap-4 pb-4 border-b-2 border-[var(--color-primary)]'>
                        <div className=' flex flex-col items-start gap-3 lg:gap-1'>
                            <p className='text-sm md:text-md font-semibold text-[var(--text-color)]/60 '>Hello,</p>
                            <p className='text-2xl font-bold text-[var(--text-color)]'>{auth?.user}</p>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2 cursor-pointer border-2 border-[var(--text-color)]/40 p-2 rounded-full transition-all duration-150 hover:scale-120 " onClick={toggleSearch}>
                                <FaSearch size={20} />
                        </div>
                    </div>
                </div>


                <div className=' relative flex-1 pt-3 w-full overflow-hidden rounded-xl'>
                    <div className={`absolute flex flex-col gap-4 items-center  w-full h-full bg-[var(--bg-color)]  ${openSearch ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-5 "} transition-all duration-150 `}>
                        <div className='w-full h-20 px-5'>
                            <input onChange={ findUsers } value={search} type="text" className='bg-[var(--color-neutral)]/20 px-4 py-3 w-full  outline-none ' placeholder='Search...' />
                        </div>
                        <div className='overflow-y-auto w-full h-full'>
                            <div className='w-full h-20 px-5 '>
                                { searchedUsers?.length > 0 ? (
                                    searchedUsers.map(user => <FoundUser user={user} key={user._id} />)
                                ) : (
                                    <div className="w-full flex justify-center">
                                        {isSearchingForUsers && search ? (
                                            <Loader className="animate-spin w-6 h-6" />
                                        ) : search ? (
                                            <p>No users</p>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='absolute overflow-y-auto w-full h-full' onClick={() => setSelectedChat(null)} >
                        {
                            participants?.length !== 0 && participants?.map((chat, i)=>
                            (
                                <div key={chat?._id}>
                                    <Friend chat={chat} online={onlineUsers?.size !== 0 && onlineUsers?.has(chat?.participants?.[0]?._id)} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar