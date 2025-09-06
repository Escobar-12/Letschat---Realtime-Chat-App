import React, { useEffect } from 'react'

import RegisterSelectProfile from '../components/RegisterSelectProfile'
import useAuthStore from '../store/AuthStore'

import { FaRegUser  } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";


const ProfilePage = () => {
  const { auth  } = useAuthStore();
  const handleImageUplaod = async (e) =>
  {

  }

  useEffect(()=>
  {
    console.log(auth);
  },[auth])

  return (
    <div className='h-screen flex justify-center text-white pt-20'>
      <div className='w-2xl ma-auto p-4 py-8'>
        {/* Profile  */}
        <div className='w-full flex flex-col items-center bg-blue-950 rounded-xl p-6'>
          <div className='flex flex-col items-center  space-y-8 '>
            <div className='text-center'>
              <h1 className='text-2xl font-semibold'>Profile</h1>
              <p>Your profile information</p>
            </div>
            <div className="w-full flex justify-center">
              <RegisterSelectProfile userImg={auth?.img}  />
            </div>
            <p className='text-sm text-zinc-400 '>
              {true ? "Uploading..." : "Click the camera icon to update your photo" }
            </p>
          </div>

          <div className='w-full flex flex-col gap-5'>

            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'><FaRegUser /> Full Name</div>
              <div className='w-full min-h-10 rounded-md border-2 text-md lg:text-xl'>{auth?.userName || ""}</div>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'><MdAlternateEmail/> Email Address</div>
              <div className='w-full min-h-10 rounded-md border-2 text-md lg:text-xl'>{auth?.email || ""}</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default ProfilePage