import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
const MainLayout = () => {
  return (
    <div className='bg-[var(--color-neutral)]'>
        <Toaster />
        <Navbar/>
        {
            <div >
                <Outlet/>
            </div>
        }
    </div>
  )
}

export default MainLayout