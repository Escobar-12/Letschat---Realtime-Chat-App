import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
const MainLayout = () => {
  return (
    <>
        <Toaster />
        <Navbar/>
        {
            <div>
                <Outlet/>
            </div>
        }
    </>
  )
}

export default MainLayout