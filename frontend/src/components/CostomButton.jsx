import React from 'react'

const CustomButton = ({label, to='/' ,disable=false}) => {
  return (
    
        <button className={`${ disable ? "bg-neutral-200/70  border-[#2884f5]/40 cursor-not-allowed" : "c-button c-button--gooey bg-white  border-[#2884f5] cursor-pointer"}  rounded-full py-[12px] border-2 transition-colors duration-150 `}>
        <p className="c-button__text">{label}</p>
        <div class={`${ disable ? "hidden" : "c-button__blobs"}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        </button>

  )
}

export default CustomButton