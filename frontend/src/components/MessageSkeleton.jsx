import React from 'react'

const MessageSkeleton = ({me = false }) => {
  return (
    <div className={`${me ? "bg-[var(--color-primary)]/60  self-end " : " bg-[var(--color-neutral)]/30 self-start"} message gap-3 px-4 flex flex-col items-start p-2 w-full max-w-xs `}>
        <div className=' h-5 w-20 bg-neutral-500 animate-pulse ' />
        <div className={` bg-neutral-500 animate-pulse h-3 w-8`} />
    </div>
  )
}

export default MessageSkeleton