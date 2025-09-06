import React from 'react';

const AuthPageEffect = () => {
  return (
    <div className='w-full h-full bg-light flex flex-col justify-center items-center space-y-10 absolute p-4 z-20 top-0 object-cover transition-all duration-700 ease-in-out'>
      <div className='grid grid-cols-3 gap-2'>
        <GlowingBox glows={true}/>
        <GlowingBox/>
        <GlowingBox glows={true}/>
        <GlowingBox/>
        <GlowingBox glows={true}/>
        <GlowingBox/>
        <GlowingBox glows={true}/>
        <GlowingBox/>
        <GlowingBox glows={true}/>
      </div>
      <div>
        <h2 className='text-lg font-semibold text-white text-center'>Join Our Community</h2>
        <p className='text-sm text-neutral-200 tracking-tight text-center'>
            Connect with friends, share moments, and stay in touch with loved ones.
        </p>
      </div>
     
    </div>
  )
}

const GlowingBox = ({ glows = false }) => {
  return (
    <div className={`w-30 h-30 rounded-lg bg-white ${glows ? "glowing" : ""}`} />
  )
}

export default AuthPageEffect;
