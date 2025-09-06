
import { useRef, useEffect, useState } from "react";
import CustomButton from "./CostomButton"

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import useAuthStore from "../store/AuthStore.js";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import RegisterSelectProfile from "../components/RegisterSelectProfile.jsx";


const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register({ setLogin }) {
  const register = useAuthStore((state) => state.register);
  const {loading} = useAuthStore();

  const userRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [img, setImg] = useState("user.png");
  const [showPwd, setShowPwd] = useState(false);

  const validName = USER_REGEX.test(user);
  const validPwd = PWD_REGEX.test(pwd);
  const validEmail = EMAIL_REGEX.test(email);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd || !validEmail) {
      setErr("Invalid input format.");
      return;
    }

    await register({ userName: user, email, pwd });
  };

  return (
    <section className="w-full flex justify-center bg-bg text-white px-3">
      <div className="flex flex-col items-start w-full py-8 px-6 space-y-8 rounded-xl">

        <div className="space-y-2 w-full">
          <h1 className="font-semibold text-3xl xl:text-4xl 3xl:text-5xl">Create an account</h1>
          <div className="flex gap-1 text-sm xl:text-lg 3xl:text-2xl">
            <p className="text-gray-400">Already have an account?</p>
            <button
              type="button"
              onClick={() => setLogin(true)}
              className="text-light hover:underline"
            >
              Login
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          {/* Profile Picker */}
          <div className="w-full flex justify-center">
            <RegisterSelectProfile setImg={setImg} />
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary text-md lg:text-lg 3xl:text-2xl"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary text-md lg:text-lg 3xl:text-2xl"
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? "false" : "true"}
          />

          {/* Password */}
            <div className="flex items-center justify-between w-full p-3 rounded-md border border-borderColor bg-box-bg  focus:ring-2 focus:ring-primary text-md lg:text-lg 3xl:text-2xl ">
                <input
                    className="outline-none flex-1"
                    type={`${showPwd ? "text":"password"}`}
                    placeholder="Enter your password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                />
                <div className="cursor-pointer text-lg" onClick={()=>setShowPwd(prev => !prev)}>
                    {pwd ? showPwd ? <FaRegEye /> : <FaRegEyeSlash/> : ""}
                </div>
            </div>

          <CustomButton
            disable={!validName || !validPwd || !validEmail || loading}
            label="Sign Up"
          />
        </form>
      </div>
    </section>
  );
}

export default Register;
