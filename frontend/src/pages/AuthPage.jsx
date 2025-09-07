import React, { useEffect, useState } from "react";
import Login from "../components/login";
import Register from "../components/register";
import AuthPageEffect from "../components/AuthPageEffect.jsx";

const AuthPage = () => {
  const [login, setLogin] = useState(true);

  useEffect(() => {
    console.log(login);
  }, [login]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* Desktop version */}
      <div className="hidden lg:block h-screen w-screen relative overflow-hidden">
        <div className="flex w-full h-full">
          <div
            className={`w-1/2 flex items-center justify-center bg-[var(--bg-color)] transition-all duration-700 ${
              login ? "z-10" : "z-0"
            }`}
          >
            <div className="w-xl">
              <Login setLogin={setLogin} />
            </div>
          </div>

          <div
            className={`w-1/2 flex items-center justify-center bg-[var(--bg-color)] transition-all duration-700 ${
              login ? "z-0" : "z-10"
            }`}
          >
            <div className="w-xl">
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
      <div className="lg:hidden mx-2 w-full max-w-[420px] shadow-xl overflow-hidden rounded-2xl bg-[var(--bg-color)]">
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
  );
};

export default AuthPage;
