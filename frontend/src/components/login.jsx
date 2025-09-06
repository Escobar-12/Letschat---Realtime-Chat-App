import { useRef, useEffect, useState } from "react";

import CustomButton from "./CostomButton"
import useAuth from "../hooks/useAuth";

import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/AuthStore.js";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const USER_REGEX = /^[A-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



function Login({ func, setLogin }) {
  const login = useAuthStore((state) => state.login);
  const {loading} = useAuthStore();

  const userRef = useRef();
  const errRef = useRef();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [showPwd, setShowPwd] = useState(false);


  const validName = USER_REGEX.test(user);
  const validPwd = PWD_REGEX.test(pwd);
  const validEmail = EMAIL_REGEX.test(user);

  useEffect(() => {
    userRef.current.focus();
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();

    if ((!validName && !validEmail) || !validPwd) {
      return;
    }
    await login({ userName: user, pwd });
  };

  return (
    <section className="w-full flex justify-center bg-bg text-white px-3">
      <div className="flex flex-col items-start w-full py-8 px-6 space-y-15 rounded-xl">

        <div className="space-y-2 w-full">
          <h1 className="font-semibold text-3xl xl:text-4xl 3xl:text-5xl">I have an account</h1>
          <div className="flex gap-1 text-sm xl:text-lg 3xl:text-2xl">
            <p className="text-gray-400">Don't have an account?</p>
            <button
              type="button"
              onClick={() => setLogin(false)}
              className="text-light hover:underline"
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          {/* User Name */}
          <input
            type="text"
            placeholder="User Name or Email"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary text-md lg:text-lg 3xl:text-2xl"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
          />

          {/* Password */}
          <div className="flex items-center justify-between w-full p-3 rounded-md border border-borderColor bg-box-bg  focus:ring-2 focus:ring-primary">
            <input
                className="outline-none flex-1 text-md lg:text-lg 3xl:text-2xl"
                type={`${showPwd ? "text":"password"}`}
                placeholder="Enter your password"
                onChange={(e) => setPwd(e.target.value)}
                required
            />
            <div className="cursor-pointer text-lg" onClick={()=>setShowPwd(prev => !prev)}>
                {pwd ? showPwd ? <FaRegEye /> : <FaRegEyeSlash/> : ""}
            </div>
          </div>
          

          <CustomButton disable={!validName || !validPwd || loading} label="Log In" />
        </form>
      </div>
    </section>
  );
}

export default Login;
