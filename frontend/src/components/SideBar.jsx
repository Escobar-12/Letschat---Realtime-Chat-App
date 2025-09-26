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
import Group from './Group';
import FoundUserSelect from './FoundUsersSelect';
import RegisterSelectProfile from './RegisterSelectProfile';



const SideBar = () => {
    const {participants, getChats, isSearchingForUsers, searchUsers, searchedUsers, setSelectedChat, isChatsLoading, clearChats, deleteChats, addNewGroup} = useChatStore();
    const {onlineUsers} = useAuthStore();

    if(!onlineUsers) return;

    const {auth} = useAuthStore();

    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);
    const groupInfoRef = useRef(null);

    const [openSearch, setOpenSearch] = useState(false);
    const [openSearchSelect, setOpenSearchSelect] = useState(false);
    const [search, setSearch] = useState("");
    const [showGroupInfoDialog, setshowGroupInfoDialog] = useState(false);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setgroupName] = useState("");
    const [groupImage, setgroupImage] = useState("");
    

    const toggleSearch = () =>
    {
        setOpenMenu(false);
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

    const createGroup = () =>
    {
        setOpenMenu(false);
        setOpenSearchSelect(true);
    }

    const joinGroup = () =>
    {
        
    }

    const create = () =>
    {
        closeDialog();
        cancel();+
        addNewGroup(selectedMembers, groupName, groupImage);
    }

    const fillInfo = ()=>
    {
        setshowGroupInfoDialog(true);
    }

    const cancel = ()=>
    {
        setOpenSearchSelect(false);
        setSelectedMembers([]);
        setgroupName("");
    }


    const checkBoundery = (e) =>
    {
        if(!openMenu) return;
        if(menuRef.current && menuRef.current.contains(e.target)) return;
        setOpenMenu(false);
    }

    const closeDialog =() =>
    {
        setshowGroupInfoDialog(false);
        setgroupName("");
        setSelectedMembers([]);
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

    useEffect(()=>
    {
        const handleBoundries = (e) =>
        {
            if(groupInfoRef.current && !groupInfoRef.current.contains(e.target)) 
            {
                closeDialog();
            }
        }
        document.addEventListener('mousedown', handleBoundries);
        return () => document.removeEventListener('mousedown', handleBoundries);
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

                            <div ref={menuRef} className={`absolute ${openMenu ? "h-fit opacity-100 ": "h-0 opacity-0 pointer-events-none" }  w-full flex flex-col gap-1 bg-[var(--bg-color)] top-full right-0 border-2 border-[var(--color-primary)]  box  transition-all duration-150`}>
                                <div className='w-full p-2 md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={deleteAllChats}>
                                    <p>Delete All Chats</p>
                                </div>
                                <div className='w-full p-1.5 text-[var(--text-color)] md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={clearAllChats}>
                                    <p>Clear All Chats</p>
                                </div>
                                <div className='w-full p-1.5 text-[var(--text-color)] md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={createGroup}>
                                    <p>Create A New Group</p>
                                </div>
                                <div className='w-full p-1.5 text-[var(--text-color)] md:text-lg font-semibold hover:md:font-bold hover:bg-[var(--color-neutral)] transition-all duration-100' onClick={"clearAllChats"}>
                                    <p>Join A Group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className=' relative flex-1 pt-3 w-full overflow-hidden rounded-xl'>
                    {/* users search  */}
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

                    {/* new goup search */}
                    <div className={`absolute flex flex-col gap-4 items-center  w-full h-full bg-[var(--bg-color)]  ${openSearchSelect ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-5 "} transition-all duration-150 `}>
                        <div className='w-full h-20 px-5'>
                            <input onChange={ findUsers } value={search} type="text" className='bg-[var(--color-neutral)]/20 px-4 py-3 w-full  outline-none ' placeholder='Search...' />
                        </div>
                        <div className='overflow-y-auto w-full h-full'>
                            <div className='w-full h-20 px-5 '>
                                { searchedUsers?.length > 0 ? (
                                    searchedUsers.map(user => <FoundUserSelect user={user} key={user._id} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers}/>)
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
                        <div className='w-full flex justify-end items-center h-30 border-t-2 border-gray-200/30 bg-[var(--bg-color)]'>
                            <div className='flex items-center gap-4 px-2'>
                                <button className='p-2 bg-red-400 hover:bg-red-500' onClick={cancel} >Cancel</button>
                                <button className='p-2 bg-green-400 hover:bg-green-500' onClick={fillInfo}>Create Group</button>
                            </div>
                        </div>
                    </div>


                 {/* Group info dialog */}
                {showGroupInfoDialog && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                        <div ref={groupInfoRef} className='bg-[var(--bg-color)] w-full max-w-md mx-4 p-6 rounded-xl shadow-lg flex flex-col items-center gap-4'>
                            <h2 className='text-xl font-bold text-[var(--text-color)]'>Create Group</h2>
                            
                            {/* Group Profile Select */}
                            <div className='w-fit'>
                                <RegisterSelectProfile setImg={setgroupImage} />
                            </div>
                            
                            {/* Group Name Input */}
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor='groupName' className='text-sm font-semibold text-[var(--text-color)]/70'>
                                    Group Name
                                </label>
                                <input
                                    id='groupName'
                                    type='text'
                                    onChange={ e => setgroupName(e.target.value)}
                                    placeholder='Enter group name...'
                                    className='w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)] bg-[var(--color-neutral)]/10 text-[var(--text-color)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition'
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='flex justify-end gap-3 mt-4 w-full'>
                                <button className='px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors' onClick={closeDialog}>
                                    Cancel
                                </button>
                                <button className='px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors' onClick={create}>
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                    <div className='absolute overflow-y-auto w-full h-full' onClick={() => setSelectedChat(null)} >
                        {
                            participants?.length !== 0 && participants?.map((chat, i)=>
                            chat?.isGroup ?
                                (
                                    <div key={chat?._id}>
                                        <Group chat={chat} />
                                    </div>
                                )
                                :
                                (
                                    <div key={chat?._id}>
                                        <Friend chat={chat} online={ onlineUsers instanceof Set && onlineUsers?.size !== 0 && onlineUsers?.has(chat?.participants?.[0]?._id)} />
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar