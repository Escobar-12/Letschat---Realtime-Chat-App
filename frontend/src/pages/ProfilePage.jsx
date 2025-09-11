import React, { useEffect } from 'react';
import RegisterSelectProfile from '../components/RegisterSelectProfile';
import useAuthStore from '../store/AuthStore';
import { FaRegUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const ProfilePage = () => {
  const { auth, isUpdatingProfile } = useAuthStore();

  return (

    // TODO : change card style

    <div className=' flex justify-center pt-5 lg:pt-20 bg-[var(--color-neutral)] text-[var(--text-color)]'>
      <div className='w-2xl mx-auto p-4 py-8 space-y-6'>
        <div className='w-full flex flex-col items-center bg-[var(--bg-color)] rounded-xl p-6 border-2 border-[var(--color-accent)] space-y-8'>
          <div className='text-center space-y-2'>
            <h1 className='text-2xl font-semibold text-[var(--color-primary)]'>Profile</h1>
            <p className='text-[var(--text-color)]'>Your profile information</p>
          </div>

          <div className='w-full flex justify-center'>
            <RegisterSelectProfile editProfile={true} userImg={auth?.img} />
          </div>
          <p className='text-sm text-[var(--color-secondary)]'>
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>

          <div className='w-full flex flex-col space-y-6'>
            <div className='flex flex-col space-y-1.5'>
              <div className='flex items-center gap-2 text-[var(--color-primary)]'>
                <FaRegUser /> Full Name
              </div>
              <div className='w-full min-h-12 rounded-md border-2 border-[var(--color-accent)] p-2 flex items-center text-md lg:text-xl'>
                {auth?.user || ""}
              </div>
            </div>

            <div className='flex flex-col space-y-1.5'>
              <div className='flex items-center gap-2 text-[var(--color-primary)]'>
                <MdAlternateEmail /> Email Address
              </div>
              <div className='w-full min-h-12 rounded-md border-2 border-[var(--color-accent)] p-2 flex items-center text-md lg:text-xl'>
                {auth?.email || ""}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-[var(--bg-color)] rounded-xl p-6 border-2 border-[var(--color-accent)]'>
          <h2 className='text-lg font-medium mb-4 text-[var(--color-primary)]'>Account Information</h2>
          <div className='space-y-3 text-sm text-[var(--text-color)]'>
            <div className='flex items-center justify-between py-2 border-b-2 border-[var(--color-accent)]'>
              <span>Member Since</span>
              <span>{auth?.createdAt?.split("T")[0]}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Account Status</span>
              <span className='text-[var(--color-accent)]'>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
