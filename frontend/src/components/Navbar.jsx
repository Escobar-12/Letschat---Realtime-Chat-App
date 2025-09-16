import React, { useState } from 'react'
import { FaRocketchat } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { Link, NavLink } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import { FiMenu } from "react-icons/fi";


const menuLinks = 
[
    { name: "Home", path: "/" },
    { name: "Settings", path: "/settings" },
    { name: "Profile", path: "/profile" },
    { name: "Logout", path: "/logout" },
]

const Navbar = () => {

  const { auth } = useAuthStore();
  const [mobileSideBar, setMobileSideBar] = useState(false);

  return (
    <div className='w-screen bg-[var(--bg-color)] text-[var(--color-primary)] shadow-2xl '>
      <div className='w-full max-w-[1650px] px-6 mx-auto flex items-center justify-between h-14'>
        <Link to={'/'} className='flex items-center  gap-2 cursor-pointer' >
          <FaRocketchat className='text-4xl p-1 bg-[var(--color-primary)]/30 box '/>
          <h1 className='text-xl font-bold '>Let's Chat</h1>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center justify-between md:gap-5 lg:gap-9'>
          <Link to={"/settings"} className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150'>
            <IoSettingsOutline className='text-xl'/>
            <p className='font-bold '>Settings</p>
          </Link>

          {auth && (
            <>
              <Link to={"/profile"} className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150'>
                <FaRegUser className='text-xl'/>
                <p className='font-bold '>Profile</p>
              </Link>
              <Link to={"/logout"} className='flex items-center cursor-pointer gap-2 hover:bg-[var(--color-primary)]/25 px-2 py-1 rounded transition-all duration-150'>
                <RxExit className='text-xl'/>
                <p className='font-bold '>Logout</p>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <FiMenu className='md:hidden text-4xl cursor-pointer hover:bg-neutral-200 transition-all duration-200 rounded-full p-1' 
          onClick={() => setMobileSideBar(prev => !prev)}
        />

        
      </div>
      {/* Mobile Sidebar */}
      <div className={` absolute w-full h-screen bg-[var(--bg-color)] z-20 transition-transform duration-200 ${mobileSideBar ? "translate-x-0" : "-translate-x-full"}`}>
        <div className='flex justify-center flex-col items-center mt-25 gap-10'>
          {menuLinks.map((link, i) => (
            (!auth && (link.name === "Profile" || link.name === "Logout")) ? null : (
              <NavLink 
                onClick={() => setMobileSideBar(false)} 
                className='mx-4 rounded-md md:text-lg font-semibold' 
                to={link.path} 
                key={i}
              >
                {link.name}
              </NavLink>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
