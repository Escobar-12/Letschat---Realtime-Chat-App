import React, { useEffect } from 'react'
import useAuthStore from '../store/AuthStore'
import { replace, useNavigate } from 'react-router-dom';


const HomePage = () => {

  const {auth} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() =>
  {
    if(!auth)
    {
      navigate('/login', {replace:true});
    }
  }
  ,[])
  return (
    <div>HomePage</div>
  )
}

export default HomePage