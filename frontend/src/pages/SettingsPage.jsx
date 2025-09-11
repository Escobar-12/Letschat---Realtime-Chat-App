import React, { useEffect } from 'react'
import ThemeBox from '../components/theme'
import { themes } from '../assets/assets'
import { useThemeStore } from '../store/useThemeStore'
import Message from '../components/Message'
import MessageInput from '../components/MessageInput'


const SettingsPage = () => {
  const { themes, setTheme } = useThemeStore();

  return (
    <div className="max-w-[1650px] mt-15 lg:mt-30 mx-auto mb-40 px-4 md:px-8 lg:px-16 w-full">
      <div className="w-full flex flex-col items-center">

        {/* Theme selection grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-8 gap-4 p-4">
          {Object.entries(themes).map(([name, vars]) => (
            <ThemeBox
              key={name}
              name={name}
              theme={vars}
              onClick={() => setTheme(name)}
            />
          ))}
        </div>

        {/* Preview section */}
        <h2 className="w-full mb-2 text-xl font-semibold text-start">Preview</h2>
        <div className="w-full flex flex-col items-center mt-2 bg-[var(--color-neutral)] rounded-2xl py-5 px-2 border-2 border-[var(--color-accent)] ">
          <div className="w-full max-w-200 flex flex-col items-center  h-fit bg-[var(--bg-color)] rounded-xl shadow-inner py-4">
            <div className="w-full max-w-2xl flex flex-col gap-4">

              {/* Header */}
              <div className="w-full flex items-center mx-2 gap-3 pb-4 border-b-2 border-[var(--color-accent)]/30">
                <div className="relative rounded-full  p-4 lg:p-6 bg-[var(--color-primary)]">
                  <p className="absolute top-1/2 left-1/2 -translate-1/2 text-[var(--bg-color)] font-semibold text-2xl">J</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[var(--color-primary)]/70 font-medium">John Doe</p>
                  <p className="text-[var(--base-300)]/40 text-sm">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="w-full flex flex-col gap-3 px-4">
                <Message text="Hey! How's it going?" time="12:00 PM" />
                <Message me text="Hello! I am good, how are you?" time="12:01 PM" />
              </div>

            </div>
            <div className='mt-8 w-full max-w-2xl px-4'>
              <MessageInput disabled/>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage