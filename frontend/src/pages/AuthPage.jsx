import React, { useEffect, useState } from "react";
import Login from "../components/login";
import Register from "../components/register";
import AuthPageEffect from "../components/AuthPageEffect.jsx";

const AuthPage = () => {
  const [login, setLogin] = useState(false);

  return (
    <div className='w-screen h-screen  bg-[var(--color-neutral)] text-[var(--text-color)]'>
      <div className="flex items-center justify-center">
        {/* Desktop version */}
        <div className="hidden lg:block h-screen w-screen relative overflow-hidden">
          <div className="flex w-full h-full">
            <div
              className={`w-1/2 flex items-center justify-center bg-[var(--bg-color)] transition-albg-[var(--color-neutral)] text-[var(--text-color)]l duration-700 ${
                login ? "z-10" : "z-0"
              }`}
            >
              <div className="max-w-xl">
                <Login setLogin={setLogin} />
              </div>
            </div>

            <div
              className={`w-1/2 flex items-center justify-center bg-[var(--bg-color)] transition-all duration-700 ${
                !login ? "z-10": "z-0" 
              }`}
            >
              <div className="max-w-xl">
                <Register setLogin={setLogin} />
              </div>
            </div>
          </div>

          <div
            className={`absolute z-20 top-0 h-full w-1/2 object-cover transition-transform duration-700 ease-in-out ${
              !login ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <AuthPageEffect />
          </div>
        </div>

        {/* Mobile version */}
        <div className="lg:hidden mx-2 mt-2 w-full max-w-[420px] shadow-xl overflow-hidden card bg-[var(--bg-color)]">
          <div
            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
              login ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            <div className="w-1/2 flex-shrink-0 flex flex-col items-center justify-center p-6">
              <Login setLogin={setLogin} />
            </div>

            <div className="w-1/2 flex-shrink-0 flex flex-col items-center justify-center p-6">
              <Register setLogin={setLogin} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
