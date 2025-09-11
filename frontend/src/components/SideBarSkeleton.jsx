import React from "react";
import { Users } from "lucide-react";


const SideBarSkeleton = () => {
  return (
    <aside className="h-full w-20 lg:w-72 bg-[var(--bg-color)] flex flex-col transition-all duration-200">
      {/* Header */}
      <div className=' p-5 '>
          <div className='flex w-full items-center justify-center lg:justify-start gap-2 pb-4 border-b-2 border-[var(--color-primary)]'>
              <Users className="size-6" />
              <span className='font-medium hidden lg:block '>Contacts</span>
          </div>
      </div>

      {/* Skeleton List */}
      <div className="overflow-y-auto w-full pt-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full px-3 py-4 flex items-center gap-3 animate-pulse">
            {/* Avatar Skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton bg-[var(--color-neutral)]/80 size-12 rounded-full"/>
            </div>

            {/* Text Skeletons */}
            <div className="hidden  lg:block text-left min-w-0 flex-1">
              <div className="skeleton bg-[var(--color-neutral)]/80 h-4 w-32 mb-2 rounded-md"/>
              <div className="skeleton bg-[var(--color-neutral)]/60 h-3 w-16 rounded-md"/>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBarSkeleton;
