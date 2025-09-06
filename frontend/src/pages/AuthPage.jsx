import React, { useEffect, useState } from "react";
import Login from "../components/login";
import Register from "../components/register";
import { assets } from "../assets/assets.js";
import AuthPageEffect from "../components/AuthPageEffect.jsx";

const AuthPage = () => {
  const [login, setLogin] = useState(true); // true => login / false => register
  useEffect(()=>
  {
    console.log(login)
  },[login])
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#686279]">
      <div className="hidden h-screen w-screen lg:block relative overflow-hidden ">
        <div className="flex w-full h-full">
          <div className={`w-1/2 flex items-center justify-center bg-bg ${login?"z-10":"z-0"}`}>
            <div className="w-xl">
              <Login setLogin={setLogin} />
            </div>
          </div>
          <div className={`w-1/2 flex items-center justify-center bg-bg ${login?"z-0":"z-10"}`}>
            <div className="w-xl">
              <Register setLogin={setLogin} />
            </div>
          </div>
        </div>

        {/* Sliding picture panel */}
        <div className={`absolute z-20  top-0 h-full w-1/2 object-cover transition-all duration-700 ease-in-out ${
            !login ? "translate-x-0" : "translate-x-full"
          }`}>
          <AuthPageEffect/>
        </div>

      </div>

      {/* Mobile version */}
      <div className="lg:hidden mx-2 w-full max-w-[420px] shadow-xl overflow-hidden rounded-2xl bg-bg">
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
