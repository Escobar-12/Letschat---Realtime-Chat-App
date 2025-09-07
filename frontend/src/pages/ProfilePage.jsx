import React, { useEffect } from 'react'

import RegisterSelectProfile from '../components/RegisterSelectProfile'
import useAuthStore from '../store/AuthStore'

import { FaRegUser  } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";


const ProfilePage = () => {
  const { auth, isUpdatingProfile  } = useAuthStore();


  useEffect(()=>
  {
    console.log(auth);
  },[auth])

  return (
    <div className='h-screen flex justify-center pt-20 bg-base-200 text-base-content'>
      <div className='w-2xl mx-auto p-4 py-8'>
        {/* Profile Card */}
        <div className='w-full flex flex-col items-center bg-base-100 rounded-xl p-6'>
          <div className='flex flex-col items-center space-y-8'>
            <div className='text-center'>
              <h1 className='text-2xl font-semibold'>Profile</h1>
              <p>Your profile information</p>
            </div>
            <div className="w-full flex justify-center">
              <RegisterSelectProfile editProfile={true} userImg={auth?.img}  />
            </div>
            <p className='text-sm text-base-content/60'>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo" }
            </p>
          </div>

          <div className='w-full flex flex-col space-y-6'>
            <div className='flex flex-col space-y-1.5'>
              <div className='flex items-center gap-2'><FaRegUser /> Full Name</div>
              <div className='w-full min-h-12 rounded-md border-2 border-base-300 text-md lg:text-xl p-2 flex items-center'>
                {auth?.user || ""}
              </div>
            </div>
            <div className='flex flex-col space-y-1.5'>
              <div className='flex items-center gap-2'><MdAlternateEmail /> Email Address</div>
              <div className='w-full min-h-12 rounded-md border-2 border-base-300 text-md lg:text-xl p-2 flex items-center'>
                {auth?.email || ""}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className='mt-6 bg-base-100 rounded-xl p-6'>
          <h2 className='text-lg font-medium mb-4'>Account Information</h2>
          <div className='space-y-3 text-sm'>
            <div className='flex items-center justify-between py-2 border-b-2 border-base-300'>
              <span>Member Since</span>
              <span>{auth?.createdAt?.split("T")[0]}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Account Status</span>
              <span className='text-success'>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ProfilePage