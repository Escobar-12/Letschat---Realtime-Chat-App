import React from 'react'
import { FaRocketchat } from "react-icons/fa6";


const DefaultChat = () => {
  return (
    <div className='w-full h-full flex flex-1 flex-col items-center justify-center p-16 bg-[var(--bg-color)] '>
        <div className=' flex flex-col items-center justify-center max-w-md text-center space-y-5'>
            <FaRocketchat className='text-5xl p-2 bg-[var(--color-primary)]/30 box animate-bounce '/>
            <h1 className='text-[var(--color-primary)]/70 text-xl font-semibold'>Welcome to 
                <span className='bg-gradient-to-r text-transparent bg-clip-text from-[var(--color-primary)] to-[var(--color-secondary)] '> Let's Chat!</span>
            </h1>
            <p className='text-[var(--base-300)]'>You can tart chatting with your friends and loved ones</p>
        </div>
    </div>
  ) 
}

export default DefaultChat