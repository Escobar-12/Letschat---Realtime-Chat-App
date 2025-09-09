import React from 'react'
import { FaRocketchat } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  return (
    <div className='w-screen bg-[var(--color-neutral)] text-[var(--color-primary)] '>
      <div className='w-full max-w-[1650px] mx-auto flex items-center justify-between py-2'>
        <div className='flex items-center  gap-2 cursor-pointer' onClick={() => navigate('/')}>
          <FaRocketchat className='text-4xl p-1 bg-[var(--color-primary)]/30 box '/>
          <h1 className='text-xl font-bold '>Let's Chat</h1>
        </div>

        <div className='flex items-center justify-between md:gap-5 lg:gap-9'>
          <div className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150' onClick={() => navigate('/settings')}>
            <IoSettingsOutline className='text-xl'/>
            <p className='font-bold '>Settings</p>
          </div>
          <div className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150' onClick={() => navigate('/profile')}>
            <FaRegUser className='text-xl'/>
            <p className='font-bold '>Profile</p>
          </div>
          <div className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150' onClick={() => navigate('/logout')}>
            <RxExit className='text-xl'/>
            <p className='font-bold '>Settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar