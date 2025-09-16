import React from "react";
import { FaSearch } from "react-icons/fa";


const SideBarSkeleton = () => {
  return (
    <aside className='h-[calc(100vh-80px)] md:h-full w-full md:w-84 max-md:m-3 bg-[var(--bg-color)] transition-all duration-200 rounded-xl' >
      {/* Header */}
        <div className=' relative w-full h-full flex flex-col'>
           <div className='flex items-center justify-between p-5'>
              <div className='flex justify-between w-full items-center gap-4 pb-4 border-b-2 border-[var(--color-primary)]'>
                  <div className=' flex flex-col items-start gap-6 animate-pulse'>
                    <div className="skeleton bg-[var(--color-neutral)]/60 h-3 w-16 rounded-md"/>
                    <div className="skeleton bg-[var(--color-neutral)]/80 h-4 w-32 mb-2 rounded-md"/>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 cursor-pointer border-2 border-[var(--text-color)]/40 p-2 rounded-full transition-all duration-150 hover:scale-120 ">
                          <FaSearch size={20} />
                  </div>
              </div>
            </div>
           


        {/* Skeleton List */}
        <div className=' relative flex-1 pt-3 w-full overflow-hidden'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full px-3 py-4 flex items-center gap-3 animate-pulse">
              {/* Avatar Skeleton */}
              <div className="relative">
                <div className="skeleton bg-[var(--color-neutral)]/80 size-8 md:size-12 rounded-full"/>
              </div>

              {/* Text Skeletons */}
              <div className="text-left min-w-0 flex-1">
                <div className="skeleton bg-[var(--color-neutral)]/80 h-4 w-32 mb-2 rounded-md"/>
                <div className="skeleton bg-[var(--color-neutral)]/60 h-3 w-16 rounded-md"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBarSkeleton;
