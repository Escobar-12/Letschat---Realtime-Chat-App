import React, { useEffect, useState } from "react";
import Login from "../components/login";
import Register from "../components/register";
import { assets } from "../assets/assets.js";

const AuthPage = () => {
  const [login, setLogin] = useState(true); // true => login / false => register
  useEffect(()=>
  {
    console.log(login)
  },[login])
  return (
    <div className="h-screen flex h-screen items-center justify-center bg-[#686279]">
      <div className="hidden md:block mx-3 relative overflow-hidden shadow-xl rounded-2xl">
        <div className="flex w-full h-full">
          <div className={`w-1/2 flex items-center justify-center bg-[#2c2638] ${login?"z-10":"z-0"}`}>
            <Login setLogin={setLogin} />
          </div>
          <div className={`w-1/2 flex items-center justify-center bg-[#2c2638] ${login?"z-0":"z-10"}`}>
            <Register setLogin={setLogin} />
          </div>
        </div>

        {/* Sliding picture panel */}
        <img
          src={assets.loginBG}
          className={`absolute rounded-2xl p-3 z-20 top-0 h-full w-1/2 object-cover transition-all duration-700 ease-in-out ${
            !login ? "left-0" : "left-1/2"
          }`}
        />

      </div>

      {/* Mobile version */}
      <div className="md:hidden relative w-[95%] max-w-[420px] overflow-hidden shadow-xl rounded-2xl">
        <div
          className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${
            login ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          <div className="w-1/2 flex items-center justify-center bg-[#2c2638]">
            <Login setLogin={setLogin} />
          </div>
          <div className="w-1/2 flex items-center justify-center bg-[#2c2638]">
            <Register setLogin={setLogin} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;
