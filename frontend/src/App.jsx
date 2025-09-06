import React, { useEffect } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

import useAuthStore from './store/AuthStore';

import {Loader} from "lucide-react"
import Logout from './pages/Logout';




function App() {

  const { auth, isChecking, checkAuth } = useAuthStore();
  


  const router = createBrowserRouter([
      {
        path:"/", element: <MainLayout/>,
        children: [
          {index: true, element:auth ? <HomePage/> : <Navigate to="login"/>},
          {path: "settings", element:<SettingsPage/>},
          {path: "profile", element:auth ? <ProfilePage/> : <Navigate to="/login"/>},
          {path: "login", element:!auth ? <AuthPage/> : <Navigate to="/"/>},
          {path: "logout", element:auth ? <Logout/> : <Navigate to="/login"/>},
        ]
      }
  ])

  if (isChecking && !auth) 
  {
    return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin w-6 h-6" /></div>
  }

  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
