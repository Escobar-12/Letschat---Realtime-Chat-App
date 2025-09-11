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
      <div className='flex items-center justify-center pt-5 px-4 ' >
        <div className='bg-[var(--color-neutral) rounded-lg shadow-2xl w-full h-[89vh] max-h-6xl max-w-6xl '>
          <div className='flex space-x-2 h-full w-full rounded-lg overflow-hidden'>
            <SideBar/>
            {
              !selectedChat ? <DefaultChat/> : <ChatContainer/>
            }
          </div>
        </div>
      </div>
  )
}

export default HomePage