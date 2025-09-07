import React from 'react';

const AuthPageEffect = () => {
  return (
    <div className="w-full h-full bg-[var(--color-primary)] flex flex-col justify-center items-center space-y-8 absolute top-0 p-4 z-20 object-cover transition-all duration-700 ease-in-out">
      
      <div className="grid grid-cols-3 gap-3">
        <GlowingBox glows />
        <GlowingBox />
        <GlowingBox glows />
        <GlowingBox />
        <GlowingBox glows />
        <GlowingBox />
        <GlowingBox glows />
        <GlowingBox />
        <GlowingBox glows />
      </div>

      <div className="text-center max-w-xs px-2">
        <h2 className="text-lg lg:text-xl font-semibold text-[var(--color-primary)]">
          Join Our Community
        </h2>
        <p className="text-sm lg:text-base text-[var(--color-neutral)] tracking-tight mt-2 font-bold ">
          Connect with friends, share moments, and stay in touch with loved ones.
        </p>
      </div>

    </div>
  );
};

const GlowingBox = ({ glows = false }) => {
  return (
    <div
      className={`
        w-20 h-20 lg:w-24 lg:h-24 rounded-lg bg-[var(--color-neutral)]
        ${glows ? "animate-pulse shadow-[0_0_15px_4px_var(--color-primary)]" : ""}
        transition-all duration-500
      `}
    />
  );
};

export default AuthPageEffect;
