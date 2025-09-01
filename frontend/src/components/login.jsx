import { useRef, useEffect, useState } from "react";

import CustomButton from "./CostomButton"
import useAuth from "../hooks/useAuth";

import { useNavigate, useLocation } from "react-router-dom";

const USER_REGEX = /^[A-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;



function Login({ func, Logged, setLogin }) {
  const { setAuth, setToken, checkAuth } = useAuth();

  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const validName = USER_REGEX.test(user);
  const validPwd = PWD_REGEX.test(pwd);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErr("");
  }, [user, pwd]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd) {
      setErr("Invalid username or password format.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user, pwd }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "An error occurred");
        return;
      }

      const roles = data.role;
      const img = data.profile;
      const id = data.id;

      setErr("");
      setToken(data.Access_token);
      const userData = { user, roles, img, id, Access_token: data.Access_token };
      setAuth(userData);
      localStorage.setItem("auth", JSON.stringify(userData));
      checkAuth();
      Logged();
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <section className="w-full flex justify-center bg-bg text-white px-3">
      <div className="flex flex-col items-start w-full py-8 px-6 space-y-10 rounded-xl">
        {err && (
          <p ref={errRef} className="text-red-500 text-center">
            {err}
          </p>
        )}

        <div className="space-y-2 w-full">
          <h1 className="font-semibold text-3xl">I have an account</h1>
          <div className="flex gap-1 text-sm">
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

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          {/* User Name */}
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
            onFocus={() => {}}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-md border border-borderColor bg-box-bg focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"}
          />

          <CustomButton disable={!validName || !validPwd} label="Log In" />
        </form>
      </div>
    </section>
  );
}

export default Login;
