import { useRef, useEffect, useState } from "react";
import CustomButton from "./CostomButton";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/AuthStore.js";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const USER_REGEX = /^[A-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ setLogin }) {
  const loginAction = useAuthStore((state) => state.login);
  const { loading } = useAuthStore();
  const navigate = useNavigate();

  const userRef = useRef();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const validName = USER_REGEX.test(user);
  const validEmail = EMAIL_REGEX.test(user);
  const validPwd = PWD_REGEX.test(pwd);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if ((!validName && !validEmail) || !validPwd) return;
    const res = await loginAction({ userName: user, pwd, redirect: from });
    if(res) navigate('/');
  };

  return (
    <section className="flex justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-3">
      <div className="flex flex-col items-start w-full py-8 px-6 space-y-15 rounded-xl">
        <div className="space-y-2 w-full">
          <h1 className="font-semibold text-3xl xl:text-4xl 3xl:text-5xl text-[var(--color-primary)]">
            Welcome Back
          </h1>
          <div className="flex gap-1 text-sm xl:text-lg 3xl:text-2xl">
            <p className="text-[var(--color-neutral)]">Don't have an account?</p>
            <button
              type="button"
              onClick={() => setLogin(false)}
              className="text-[var(--color-primary)] hover:underline"
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full p-3 rounded-md border border-[var(--color-accent)] bg-[var(--color-neutral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-md lg:text-lg 3xl:text-2xl"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <div className="input flex items-center justify-between w-full p-3 rounded-md border border-[var(--color-accent)] bg-[var(--color-neutral)] focus:ring-2 focus:ring-[var(--color-primary)]">
            <input
              className="outline-none flex-1 text-md lg:text-lg 3xl:text-2xl bg-transparent text-[var(--text-color)]"
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <div
              className="cursor-pointer text-lg text-[var(--color-primary)]"
              onClick={() => setShowPwd((prev) => !prev)}
            >
              {pwd ? (showPwd ? <FaRegEye /> : <FaRegEyeSlash />) : ""}
            </div>
          </div>

          <CustomButton
            disable={(!validName && !validEmail) || !validPwd || loading}
            loading={loading}
            label="Log In"
          />
        </form>
      </div>
    </section>
  );
}

export default Login;
