import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';


const router = createBrowserRouter([
    {
      path:"/", element: <MainLayout/>,
      children: [
        {index: true, element:<AuthPage/>},
        {index: "settings", element:<SettingsPage/>},
        {index: "profile", element:<ProfilePage/>},
      ]
    }
])


function App() {

  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
