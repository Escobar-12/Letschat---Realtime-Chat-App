import React, { useEffect, useState } from "react";
import Login from "../components/login";
import Register from "../components/register";
import { assets } from "../assets/assets.js";
import AuthPageEffect from "../components/AuthPageEffect.jsx";

const AuthPage = () => {
  const [login, setLogin] = useState(false); // true => login / false => register
  useEffect(()=>
  {
    console.log(login)
  },[login])
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#686279]">
      <div className="hidden w-full max-w-3xl md:block mx-3 relative overflow-hidden shadow-xl rounded-2xl">
        <div className="flex w-full h-full">
          <div className={`w-1/2 flex items-center justify-center bg-bg ${login?"z-10":"z-0"}`}>
            <Login setLogin={setLogin} />
          </div>
          <div className={`w-1/2 flex items-center justify-center bg-bg ${login?"z-0":"z-10"}`}>
            <Register setLogin={setLogin} />
          </div>
        </div>

        {/* Sliding picture panel */}
        <div className={`absolute z-20 rounded-3xl top-0 h-full w-1/2 object-cover transition-all duration-700 ease-in-out ${
            !login ? "translate-x-0" : "translate-x-full"
          }`}>
          <AuthPageEffect/>
        </div>

      </div>

      {/* Mobile version */}
      <div className="md:hidden mx-2 w-full max-w-[420px] shadow-xl overflow-hidden rounded-2xl bg-bg">
        <div
          className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
            login ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* Login */}
          <div className="w-1/2 flex-shrink-0 flex flex-col items-center justify-center p-6">
            <Login setLogin={setLogin} />
          </div>

          {/* Register */}
          <div className="w-1/2 flex-shrink-0 flex flex-col items-center justify-center p-6">
            <Register setLogin={setLogin} />
          </div>
        </div>
      </div>


    </div>
  );
};

export default AuthPage;
