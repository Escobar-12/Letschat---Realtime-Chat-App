import React, { useEffect, useRef, useState } from 'react'
import {Loader} from "lucide-react" 

import useChatStore from '../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';
import FirstLetterProfile from './FirstLetterProfile';
import useAuthStore from '../store/AuthStore';
import Friend from './Friend';
import FoundUser from './SearchedUsers';

import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";



const SideBar = () => {
    const {participants, getChats, isSearchingForUsers, searchUsers, searchedUsers, setSelectedChat, isChatsLoading, clearChats, deleteChats} = useChatStore();
    const {onlineUsers} = useAuthStore();

    if(!onlineUsers) return;

    const {auth} = useAuthStore();

    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef();

    const [openSearch, setOpenSearch] = useState(false);
    const [search, setSearch] = useState("");

    const toggleSearch = () =>
    {
        setOpenSearch(prev => !prev);

    }

    const toggleMenu = () =>
    {
        setOpenMenu(prev => !prev);
    }

    const findUsers = (e) =>
    {
        setSearch(e.target.value);
    }

    const deleteAllChats = () => 
    {
        deleteChats();
        setOpenMenu(false);
    }

    const clearAllChats = () => 
    {
        clearChats();
        setOpenMenu(false);
    }

    const checkBoundery = (e) =>
    {
        if(!openMenu) return;
        if(menuRef.current && menuRef.current.contains(e.target)) return;
        setOpenMenu(false);
    }

    useEffect(()=>
    {
        document.addEventListener('mousedown', checkBoundery);
        return () => document.removeEventListener('mousedown', checkBoundery);
    },[openMenu])

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
                <div className=' flex items-center justify-between p-5'>
                    <div className=' relative z-20 flex justify-between w-full items-center gap-4 pb-4 border-b-2 border-[var(--color-primary)]'>
                        <div className=' flex flex-col items-start gap-3 lg:gap-1'>
                            <p className='text-sm md:text-md font-semibold text-[var(--text-color)]/60 '>Hello,</p>
                            <p className='text-2xl font-bold text-[var(--text-color)]'>{auth?.user}</p>
                        </div>
                        
                        <div className=" flex items-center justify-between gap-2" >
                            <div className='border-2 border-[var(--text-color)]/40 p-2 cursor-pointer rounded-full transition-all duration-150 hover:scale-105' onClick={toggleSearch}>
                                <FaSearch size={20}/>
                            </div>
                            <div className='border-2 border-[var(--text-color)]/40 p-2 cursor-pointer rounded-full transition-all duration-150 hover:scale-105' onClick={toggleMenu}>
                                <HiDotsVertical size={20}/>
                            </div>

                            {/* TODO: fix z index */}

                            <div ref={menuRef} className={`absolute ${openMenu ? "h-fit opacity-100 ": "h-0 opacity-0 pointer-events-none" }  w-full flex flex-col gap-1 bg-[var(--bg-color)] top-full right-0 border-2 border-[var(--color-primary)]  box  transition-all duration-150`}>
                                <div className='w-full p-2 md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={deleteAllChats}>
                                    <p>Delete All Chats</p>
                                </div>
                                <div className='w-full p-1.5 text-[var(--text-color)] md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={clearAllChats}>
                                    <p>Clear All Chats</p>
                                </div>
                            </div>
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