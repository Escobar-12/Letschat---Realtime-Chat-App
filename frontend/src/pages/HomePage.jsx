import React, { useEffect } from 'react'
import useAuthStore from '../store/AuthStore'
import { replace, useNavigate } from 'react-router-dom';
import useChatStore from '../store/useChatStore';
import SideBar from '../components/SideBar';
import DefaultChat from '../components/DefaultChat';
import ChatContainer from '../components/ChatContainer';


const HomePage = () => {

  const navigate = useNavigate();
  const {auth} = useAuthStore();
  const {selectedChat} = useChatStore();

  useEffect(() =>
  {
    if(!auth)
    {
      navigate('/login', {replace:true});
    }
  }
  ,[])


  return (

    <div className='flex items-center justify-center mx-auto max-w-[1650px] w-full ' >
      <div className='hidden sm:flex items-start justify-center pt-5 gap-3 w-full h-[90vh] mx-10'>
        <SideBar/>
        {
          !selectedChat ? <DefaultChat/> : <ChatContainer/>
        }
      </div>
    </div>
  )
}

export default HomePage