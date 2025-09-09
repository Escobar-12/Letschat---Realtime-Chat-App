import React from 'react'

const Message = ({me = false, text="", time="" }) => {
  return (
    <div className={`${me ? "text-[var(--color-neutral)] bg-[var(--color-primary)]/60  self-end " : "text-[var(--color-primary)] bg-[var(--color-neutral)]/30 self-start"} message flex flex-col items-start p-2`}>
        <p className='text-lg lg:text-xl font-semibold'>{text}</p>
        <p className={`text-sm lg:text-md ${me ? "text-[var(--color-neutral)]/60" : "text-[var(--color-primary)]/50" } font-bold`}>{time}</p>
    </div>
  )
}

export default Message